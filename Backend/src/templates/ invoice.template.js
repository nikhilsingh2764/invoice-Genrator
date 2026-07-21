const generateInvoiceTemplate = (doc, invoice) => {


    const currency = "₹";


    // =========================
    // Header
    // =========================

    doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(invoice.business.businessName || "Business Name");


    doc
        .fontSize(10)
        .font("Helvetica")
        .text(invoice.business.email || "")
        .text(invoice.business.phone || "")
        .text(invoice.business.address || "");



    doc.moveDown();



    // Line
    doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();



    doc.moveDown();



    // =========================
    // Invoice Title
    // =========================

    doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("INVOICE", {
            align: "right"
        });



    doc.moveDown();



    // =========================
    // Invoice Details
    // =========================


    doc
        .fontSize(11)
        .font("Helvetica")
        .text(
            `Invoice Number: ${invoice.invoiceNumber}`
        )
        .text(
            `Invoice Date: ${
                new Date(invoice.invoiceDate)
                .toLocaleDateString()
            }`
        )
        .text(
            `Due Date: ${
                new Date(invoice.dueDate)
                .toLocaleDateString()
            }`
        )
        .text(
            `Status: ${invoice.status}`
        );



    doc.moveDown(2);



    // =========================
    // Customer Details
    // =========================


    doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Bill To");


    doc
        .fontSize(11)
        .font("Helvetica")
        .text(
            invoice.customer.customerName ||
            invoice.customer.name
        )
        .text(invoice.customer.email || "")
        .text(invoice.customer.phone || "")
        .text(invoice.customer.address || "");



    doc.moveDown(2);



    // =========================
    // Items Table Header
    // =========================


    doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Items");



    doc.moveDown();



    doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(
            "Item Description        Qty        Price"
        );



    doc.moveDown();



    doc
        .font("Helvetica");



    invoice.items.forEach((item, index) => {


        doc.text(
            `${index + 1}. ${
                item.name || item.itemName
            }          ${
                item.quantity
            }          ${currency}${item.price}`
        );


    });



    doc.moveDown(2);



    // =========================
    // Amount Summary
    // =========================


    doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Payment Summary");



    doc
        .fontSize(11)
        .font("Helvetica")
        .text(
            `Subtotal: ${currency}${invoice.subTotal}`
        )
        .text(
            `Tax: ${currency}${invoice.totalTax}`
        )
        .text(
            `Discount: ${currency}${invoice.totalDiscount}`
        );



    doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(
            `Total Amount: ${currency}${invoice.grandTotal}`
        );



    doc.moveDown(2);



    // =========================
    // Payment Information
    // =========================


    doc
        .fontSize(11)
        .font("Helvetica")
        .text(
            `Payment Method: ${invoice.paymentMethod}`
        );



    doc.moveDown();



    // =========================
    // Notes
    // =========================


    if(invoice.notes){

        doc
        .text(
            `Notes: ${invoice.notes}`
        );

    }



    doc.moveDown();



    if(invoice.termsAndConditions){

        doc
        .text(
            `Terms: ${invoice.termsAndConditions}`
        );

    }



    doc.moveDown(3);



    // Footer

    doc
        .fontSize(10)
        .font("Helvetica")
        .text(
            "Thank you for your business!",
            {
                align:"center"
            }
        );


};


export default generateInvoiceTemplate;