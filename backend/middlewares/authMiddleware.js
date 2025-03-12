const jwt = require("jsonwebtoken");

exports.fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ errors: "Please authenticate using a valid token" });

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ errors: "Invalid token" });
    }
};
