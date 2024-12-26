import nodemailer from "nodemailer";
import { Subscripe } from "../models/subscripe.model.js";
import { appConfig } from "../consts.js";


const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); 
}
// Email göndərmə funksiyası
const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: appConfig.USER_EMAIL,
            pass: appConfig.USER_PASSWORD,
        },
    });

    const mailOptions = {
        from: appConfig.USER_EMAIL,
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send verification email");
    }
};

// Yeni email əlavə etmək və ya kod yeniləmək
const verifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const subscription = await Subscripe.findOne({ email });

        const verificationCode = generateVerificationCode(); // 6 rəqəmli Random testiq kodu
        const codeExpireAt = Date.now() + 10 * 60 * 1000; // Kodun 1 dəqiqə etibarlılığı

        if (!subscription) {

            subscription = new Subscripe({
                email,
                verificationCode,
                codeExpireAt,
                isVerified: false,
            });
            await subscription.save();
        } else {
            // Mövcud email üçün kod və müddət yenilənir
            subscription.verificationCode = verificationCode;
            subscription.codeExpireAt = codeExpireAt;
            await subscription.save();
        }

        // Email göndər
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({ message: "Verification email sent successfully!" });
    } catch (error) {
        console.error("Error in subscripe:", error.message);
        res.status(500).json({ message: "An error occurred during subscription." });
    }
};

// Email təsdiqləmə funksiyası
const verifyEmailCheck = async (req, res) => {
    const { email, code } = req.body;

    try {
        const subscription = await Subscripe.findOne({ email });

        if (!subscription) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Kodun müddətini yoxla
        if (Date.now() > subscription.codeExpireAt) {
            return res.status(400).json({ message: "Verification code has expired!" });
        }

        if (subscription.verificationCode === code) {
            subscription.isVerified = true;
            subscription.verificationCode = null; // Kod artıq lazım deyil
            subscription.codeExpireAt = null; // Kod müddəti sıfırlanır
            await subscription.save();
            return res.status(200).json({ message: "Email verified successfully!" });
        } else {
            return res.status(400).json({ message: "Invalid verification code!" });
        }
    } catch (error) {
        console.error("Error in verifyEmail:", error.message);
        res.status(500).json({ message: "An error occurred during email verification." });
    }
};

// Controller-i export et
export const subscripeController = {
    verifyEmail,
    verifyEmailCheck,
};
