const jwt = require('jsonwebtoken');

exports.cookiesJwtAuth = (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    console.log('Token is : ',token);
    if (!token) {
        // return res.status(401).json({ message: 'Log in first' });
        return res.redirect('/login');
    }
    try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        console.error('JWT verification failed:', error);
        return res.redirect('/login');
    }
};
    