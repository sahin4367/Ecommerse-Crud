

export const userRole = async (req, res, next) => {
    if(req.user.role !== "admin") {
        // return res.json("Yanliz admin daxil ola biler!")
    }

        next();

}