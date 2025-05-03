import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Finance App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw new Error('Email send failed');
    }
};

export default sendEmail;
