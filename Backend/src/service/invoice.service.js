import ApiError from '../utils/ApiError.js';

import invoiceRepository from "../repository/invoice.repository.js";
import businessRepository from "../repository/business.repository.js";
import customerRepository from "../repository/customer.repository.js";

import generateInvoicePDF from '../utils/generateInvoicePDF.js';

import { buildInvoiceItems } from '../helper/invoice.helper.js';

import generateInvoiceEmailContent from '../utils/ generateInvoiceEmailContent.js';

import sendEmail from './email.service.js';

export const createInvoiceService = async (userData) => {

    const {

        userId,
        customerId,
        items,
        dueDate,
        paymentMethod,
        notes,
        status

    } = userData;

    // Find Business

    const business = await businessRepository.findByUserId(userId);

    if (!business) {
        throw new ApiError(404, "Business profile not found");
    }

    //find Customer

    const customer = await customerRepository.findById(customerId)

    if (!customer) {
        throw new ApiError(404, "Customer profile not found");
    }

    //validate items

    const {
        invoiceItems,
        subTotal,
        totalTax,
        totalDiscount,
        grandTotal
    } = await buildInvoiceItems(items);



    // Generate invoice number
    const updatedBusiness = await businessRepository.incrementInvoiceNumber(userId);

    const invoiceNumber = `${updatedBusiness.invoicePrefix}-${updatedBusiness.invoiceStartNumber}`;



    // Create invoice 
    const invoice = await invoiceRepository.create({

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

    });


    // Increment invoice number for next invoice
    await businessRepository.updateByUserId(userId, {
        invoiceStartNumber: business.invoiceStartNumber + 1
    });

    return invoice;


};


export const getAllInvoicesService = async (userId, filterOptions) => {


    const invoices = await invoiceRepository.findAllWithFilters(userId, filterOptions)

    return invoices;

};


export const getInvoiceByIdService = async (userId, invoiceId) => {

    const invoice = await invoiceRepository.findById(userId, invoiceId)

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    return invoice;

};


export const updateInvoiceService = async (
    userId,
    invoiceId,
    updatedData
) => {

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

    return updatedInvoice;
};


export const deleteInvoiceService = async (userId, invoiceId) => {

    const invoiceExist = await invoiceRepository.existsById(userId, invoiceId);

    if (!invoiceExist) {
        throw new ApiError(404, "Invoice not found");

    }
    await invoiceRepository.deleteById(userId, invoiceId)

    return null;
};


export const downloadInvoicePDFService = async (userId, invoiceId) => {

    const invoice = await invoiceRepository.findById(userId, invoiceId)

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    const pdfBuffer = await generateInvoicePDF(invoice)

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


export const sendInvoiceWhatsappService = async (userId, invoiceId) => {

};


export const duplicateInvoiceService = async (userId, invoiceId) => {

};



