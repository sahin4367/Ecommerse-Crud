import jwt from "jsonwebtoken";
import { appConfig } from "../consts.js";
import { User } from "../models/user.model.js";

export const useAuth = async (req, res, next) => {
    try {
        // Authorization başlığını yoxla
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token tapılmadı" });
        }

        // Token əldə et
        const access_token = authHeader.split(" ")[1];
        if (!access_token) {
            return res.status(401).json({ message: "Token tapılmadı" });
        }

        // Tokeni təsdiqlə
        const jwtResult = jwt.verify(access_token, process.env.JWT_SECRET);
        if (!jwtResult) {
            return res.status(403).json({ message: "Token etibarsızdır" });
        }

        // İstifadəçini tap
        const user = await User.findById(jwtResult.sub).select("_id email name surname role");
        if (!user) {
            return res.status(404).json({ message: "User tapılmadı" });
        }

        // İstifadəçi məlumatını sorğuya əlavə et
        req.user = user;

        // Middleware-dən çıx və növbəti handler-ə keç
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server xətası",
            error: error.message,
        });
    }
};

