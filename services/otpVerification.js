const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const password = process.env.GMAIL_PASSWORD;
const senderEmail = process.env.GMAIL_USER;

const sendOtpEmail = async (to, subject, text,otp) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: senderEmail,
                pass: password,
            },
        });
        const mailOptions = {
            from: `XUXU <${senderEmail}>`,
            to,
            subject,
            text:`${text}`,
            html:  `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
            <div style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 8px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 10px;">You're Invited! 🎉</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">${text}</p>
            <div style="background: #ff5722; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block; margin: 10px 0;">
            OTP Code: ${otp}
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #777;">© 2025 XUXU. All rights reserved.</p>
            </div>
            </div>
        `,
        };

        const result = await transport.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return result;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};

module.exports= { sendOtpEmail};