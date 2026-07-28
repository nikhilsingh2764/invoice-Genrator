import ApiError from '../../utils/ApiError.js';

import invoiceRepository from "../../repository/invoice/invoice.repository.js";
import businessRepository from "../../repository/invoice/business.repository.js";
import customerRepository from "../../repository/invoice/customer.repository.js";

import generateInvoicePDF from '../../utils/generateInvoicePDF.js';

import { buildInvoiceItems } from '../../helper/invoice.helper.js';

import generateInvoiceEmailContent from '../../utils/ generateInvoiceEmailContent.js';

import sendEmail from './email.service.js';

import mongoose from "mongoose";
import redis from "../../config/redis.js";



export const createInvoiceService = async (userData) => {

    const session = await mongoose.startSession();

    try {

        // Start transaction
        session.startTransaction();

        const {
            userId,
            customerId,
            items,
            dueDate,
            paymentMethod,
            notes,
            status
        } = userData;

        // Increment invoice number
        const business = await businessRepository.incrementInvoiceNumber(
            userId,
            session
        );

        if (!business) {
            throw new ApiError(404, "Business profile not found");
        }

        // Find customer
        const customer = await customerRepository.findById(customerId);

        if (!customer) {
            throw new ApiError(404, "Customer profile not found");
        }

        // Build invoice items
        const {
            invoiceItems,
            subTotal,
            totalTax,
            totalDiscount,
            grandTotal
        } = await buildInvoiceItems(items);

        const invoiceNumber =
            `${business.invoicePrefix}-${business.invoiceStartNumber}`;

        // Create invoice
        const invoice = await invoiceRepository.create(
            {
                userId,

                business: {
                    businessName: business.businessName,
                    ownerName: business.ownerName,
                    email: business.email,
                    phone: business.phone,
                    gstNumber: business.gstNumber,
                    logo: business.logo,
                    signature: business.signature,
                    currency: business.currency,
                    address: business.address
                },

                customer: {
                    customerName: customer.customerName,
                    email: customer.email,
                    phone: customer.phone,
                    companyName: customer.companyName,
                    gstNumber: customer.gstNumber,
                    customerType: customer.customerType,
                    notes: customer.notes,
                    billingAddress: customer.billingAddress,
                    shippingAddress: customer.shippingAddress
                },

                items: invoiceItems,

                invoiceNumber,

                subTotal,
                totalTax,
                totalDiscount,
                grandTotal,

                dueDate,
                paymentMethod,
                notes,

                termsAndConditions: business.termsAndConditions,

                status
            },
            session
        );

        await session.commitTransaction();

        //remove invoice list cache
        await redis.del(`invoices:${userId}:*`)

        //* is only used when deleting multiple keys
        //storing multipe keys no need of any special character 
        // only define key is single or multiple like invoice: || invoices:


        return invoice;

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        await session.endSession();

    }
};



export const getInvoiceByIdService = async (userId, invoiceId) => {

    const cacheKey = `invoice:${invoiceId}:${userId}`;

    //get redis
    const cacheInvoice = await redis.get(cacheKey);

    if (cacheInvoice) {
        return JSON.parse(cacheInvoice);
    }


    const invoice = await invoiceRepository.findById(userId, invoiceId)

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }


    //set redis

    await redis.set(
        cacheKey,
        JSON.stringify(invoice),
        'EX',
        600
    );
    return invoice;

};


export const updateInvoiceService = async (userId, invoiceId, updatedData) => {

    const invoice = await invoiceRepository.findById(userId, invoiceId);

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    // Rebuild invoice items and totals if items are updated
    if (updatedData.items) {

        const {
            invoiceItems,
            subTotal,
            totalTax,
            totalDiscount,
            grandTotal
        } = await buildInvoiceItems(updatedData.items);

        updatedData.items = invoiceItems;
        updatedData.subTotal = subTotal;
        updatedData.totalTax = totalTax;
        updatedData.totalDiscount = totalDiscount;
        updatedData.grandTotal = grandTotal;
    }

    // Update embedded customer snapshot if customer changes
    if (updatedData.customerId) {

        const customer = await customerRepository.findById(updatedData.customerId);

        if (!customer) {
            throw new ApiError(404, "Customer profile not found");
        }

        updatedData.customer = {
            customerName: customer.customerName,
            email: customer.email,
            phone: customer.phone,
            companyName: customer.companyName,
            gstNumber: customer.gstNumber,
            customerType: customer.customerType,
            notes: customer.notes,
            billingAddress: customer.billingAddress,
            shippingAddress: customer.shippingAddress
        };
    }

    const updatedInvoice = await invoiceRepository.updateById(
        userId,
        invoiceId,
        updatedData
    );

    //remove invoice single cache
    await redis.del(`invoice:${userId}`)


    //remove invoice list cache
    await redis.del(`invoices:${userId}:*`)


    return updatedInvoice;
};


export const deleteInvoiceService = async (userId, invoiceId) => {

    const invoiceExist = await invoiceRepository.existsById(userId, invoiceId);

    if (!invoiceExist) {
        throw new ApiError(404, "Invoice not found");

    }
    await invoiceRepository.deleteById(userId, invoiceId)

    //remove invoice single cache
    await redis.del(`invoice:${userId}`)


    //remove invoice list cache
    await redis.del(`invoices:${userId}:*`)

    return null;
};


export const downloadInvoicePDFService = async (userId, invoiceId) => {

    const cacheKey = `invoice:pdf:${userId}:${invoiceId}`

    //check pdf cache
    const cachedPDF = await redis.getBuffer(cacheKey);

    if (cachedPDF) {
        console.log("PDF from Redis");

        return {
            pdfBuffer: cachedPDF,
            invoiceNumber: invoiceId
        };
    }

    const invoice = await invoiceRepository.findById(userId, invoiceId);

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice)

    // Store PDF temporarily
    await redis.set(
        cacheKey,
        pdfBuffer,
        "EX",
        3600
    );


    return {
        pdfBuffer,
        invoiceNumber: invoice.invoiceNumber
    };



};


export const sendInvoiceEmailService = async (userId, invoiceId) => {


    const invoice = await invoiceRepository.findById(userId, invoiceId);

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    const pdfBuffer = await generateInvoicePDF(invoice);

    const emailContent = generateInvoiceEmailContent(invoice);


    await sendEmail({
        to: invoice.customer.email,
        subject: emailContent.subject,
        html: emailContent.body,
        attachments: [
            {
                filename: `invoice-${invoice.invoiceNumber}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf"
            }
        ]
    });

    return true;



};



export const duplicateInvoiceService = async (userId, invoiceId) => {

    // Find invoice
    const invoice = await invoiceRepository.findById(userId, invoiceId);

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    // Generate next invoice number
    const updatedBusiness = await businessRepository.incrementInvoiceNumber(userId);

    if (!updatedBusiness) {
        throw new ApiError(404, "Business profile not found");
    }

    const invoiceNumber =
        `${updatedBusiness.invoicePrefix}-${updatedBusiness.invoiceStartNumber}`;

    // Convert Mongoose document to plain object
    const duplicateInvoice = invoice.toObject();

    // Remove MongoDB generated fields
    delete duplicateInvoice._id;
    delete duplicateInvoice.__v;
    delete duplicateInvoice.createdAt;
    delete duplicateInvoice.updatedAt;

    // Calculate original payment period
    const paymentDuration =
        new Date(invoice.dueDate) - new Date(invoice.invoiceDate);

    // Update invoice fields
    duplicateInvoice.invoiceNumber = invoiceNumber;
    duplicateInvoice.status = "Draft";
    duplicateInvoice.invoiceDate = new Date();
    duplicateInvoice.dueDate = new Date(
        duplicateInvoice.invoiceDate.getTime() + paymentDuration
    );

    // Create duplicated invoice
    const newInvoice = await invoiceRepository.create(duplicateInvoice);

    return newInvoice;
};


