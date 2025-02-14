const jwt = require('jsonwebtoken');

exports.cookiesJwtAuth = (req, res, next) =>{
    const token = req.cookies.token;
    console.log("Token is:",token)
    try{
        const user = jwt.verify(token,process.env.JWT_KEY);
        req.user = user;
        next();
    }catch(error){
        res.clearCookie(token);
        return res.redirect('/login');
    }
};