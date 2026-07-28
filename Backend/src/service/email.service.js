import nodemailer from "nodemailer";
import ApiError from "../utils/ApiError.js";


// Reusable transporter for sending all application emails
const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: process.env.EMAIL_PORT,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});



const sendEmail = async ({
    to,
    subject,
    html,
    attachments = []
}) => {

    try {

        await transporter.sendMail({

            from: `"Auth System" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html,

            attachments

        });


    } catch (error) {

            console.log("EMAIL ERROR:", error);

        throw new ApiError(
            500,
            "Failed to send email"
        );

    }

};


export default sendEmail;