import nodemailer from "nodemailer";
import ApiError from "../../utils/ApiError.js";


// Create reusable SMTP transporter
const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    family: 4,

    port: 587,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 30000,

    greetingTimeout: 30000,

    socketTimeout: 30000

});


// Verify SMTP connection on server startup
transporter.verify((error) => {

    if (error) {

        console.error(
            "SMTP CONNECTION FAILED:",
            error.message
        );

    } else {

        console.log(
            "SMTP SERVER READY"
        );

    }

});


// Reusable email sending service
const sendEmail = async ({
    to,
    subject,
    html,
    attachments = []
}) => {

    try {

        const mailOptions = {

            from: `"Auth System" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html,

            attachments

        };


        const info = await transporter.sendMail(mailOptions);


        console.log(
            "EMAIL SENT:",
            info.messageId
        );


        return info;


    } catch (error) {

        console.error(
            "EMAIL SEND ERROR:",
            error.message
        );


        throw new ApiError(
            500,
            "Failed to send email"
        );

    }

};


export default sendEmail;