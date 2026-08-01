import nodemailer from "nodemailer";
import ApiError from "../../utils/ApiError.js";


// Create reusable SMTP transporter
const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: Number(process.env.EMAIL_PORT),

    secure: Number(process.env.EMAIL_PORT) === 465,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000

});


// Verify SMTP connection when application starts
transporter.verify((error) => {

    if (error) {

        console.error("SMTP CONNECTION FAILED:", error.message);

    } else {

        console.log("SMTP SERVER READY");

    }

});



// Send email service
const sendEmail = async ({
    to,
    subject,
    html,
    attachments = []
}) => {

    try {

        const info = await transporter.sendMail({

            from: `"Auth System" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html,

            attachments

        });


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