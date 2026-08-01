import ApiError from "../../utils/ApiError.js";

const sendEmail = async ({
    to,
    subject,
    html
}) => {

    try {

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {

            method: "POST",

            headers: {

                "accept": "application/json",

                "content-type": "application/json",

                "api-key": process.env.BREVO_API_KEY

            },

            body: JSON.stringify({

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

            })

        });

        if (!response.ok) {

            const error = await response.text();

            console.error(error);

            throw new ApiError(
                500,
                "Failed to send email"
            );

        }

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