
const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is unauthorized",
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Token expired",
            });
        }
        if (e.name === "JsonWebTokenError") {
            return res.status(403).json({
                success: false,
                message: "Invalid token",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = authMiddleware;

