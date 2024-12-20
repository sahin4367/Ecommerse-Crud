export const userRole = async (req, res, next) => {
    if(req.user.role !== "admin") {
        return res.json("Siz admin deyilsiniz.")
    }

        next();

}