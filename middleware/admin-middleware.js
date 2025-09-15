
const adminMiddleware = (req,res,next)=> {

    if(req.userInfo.role != 'admin'){
        return res.status(403).json({
            success: false,
            message: "You are not allowed to visit this"
        })
    };

    next();
}

module.exports = adminMiddleware;