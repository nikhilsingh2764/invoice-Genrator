import ApiResponse from "../utils/ApiResponse.js";
import TryCatch from "../middleware/TryCatch.js";

import {
    createInvoiceService, getAllInvoicesService,
    getInvoiceByIdService, updateInvoiceService, deleteInvoiceService,
    downloadInvoicePDFService, sendInvoiceEmailService, duplicateInvoiceService
} from "../service/invoice.service.js";


export const createInvoice = TryCatch(async (req, res) => {

    const userData = req.body;
    const userId = req.user._id;

    userData.userId = userId;
    const invoice = await createInvoiceService(userData);
    console.log(invoice)
    return res.status(201).json(
        new ApiResponse(201, "Invoice created successfully", invoice)
    )


});

export const getAllInvoices = TryCatch(async (req, res) => {

    const { status, startDate, endDate, search, sortBy, sortOrder, page, limit } = req.query;

    const userId = req.user._id;

    const invoices = await getAllInvoicesService(userId,
        {
            status,
            startDate,
            endDate,
            search,
            sortBy,
            sortOrder,
            page,
            limit
        }
    );
    console.log(invoices)

    return res.status(200).json(
        new ApiResponse(200, "All Invoice fetch successfully", invoices)
    )

});

export const getInvoiceById = TryCatch(async (req, res) => {

    const userId = req.user._id;

    const { id: invoiceId } = req.params;

    const invoice = await getInvoiceByIdService(userId, invoiceId);
    console.log(invoice)

    return res.status(200).json(
        new ApiResponse(200, "Invoice fetch successfully", invoice)
    )

});

export const updateInvoice = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const { id: invoiceId } = req.params;
    const updatedData = req.body;

    const updatedInvoice = await updateInvoiceService(userId, invoiceId, updatedData);
    console.log(updatedInvoice)

    return res.status(200).json(
        new ApiResponse(200, "Invoice updated successfully", updatedInvoice)
    )


});


export const deleteInvoice = TryCatch(async (req, res) => {

    const userId = req.user._id;

    const { id: invoiceId } = req.params;

    await deleteInvoiceService(userId, invoiceId);

    return res.status(200).json(
        new ApiResponse(200, "Invoice deleted successfully", null)
    )


});

export const downloadInvoicePDF = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const { id: invoiceId } = req.params;

    const { pdfBuffer, invoiceNumber } = await downloadInvoicePDFService(userId, invoiceId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceNumber}.pdf"`
    );

    return res.send(pdfBuffer);

});


export const sendInvoiceEmail = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const { id: invoiceId } = req.params;

    await sendInvoiceEmailService(userId, invoiceId);

    return res.status(200).json(
        new ApiResponse(200, "Invoice Email send successfully")
    )

});

export const sendInvoiceWhatsapp = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const { id: invoiceId } = req.params;

    await sendInvoiceWhatsappService(userId, invoiceId);

    return res.status(200).json(
        new ApiResponse(200, "Invoice Whatsapp send successfully")
    )


});

export const duplicateInvoice = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const { id: invoiceId } = req.params;

    const duplicateInvoice = await duplicateInvoiceService(userId, invoiceId);

    return res.status(200).json(
        new ApiResponse(200, "Invoice duplicate successfully", duplicateInvoice)
    )
});

