import * as brevo from "@getbrevo/brevo";
import ApiError from "../../utils/ApiError.js";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendEmail = async ({
    to,
    subject,
    html
}) => {

    try {

        await apiInstance.sendTransacEmail({

            sender: {
                name: "Invoice App",
                email: process.env.EMAIL_USER
            },

            to: [
                {
                    email: to
                }
            ],

            subject,

            htmlContent: html

        });

        console.log("EMAIL SENT");

    } catch (error) {

        console.error(error);

        throw new ApiError(
            500,
            "Failed to send email"
        );

    }

};

export default sendEmail;