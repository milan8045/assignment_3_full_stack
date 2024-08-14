module.exports.isDriver = (req, res, next) => {
    if (req.session.user && req.session.user.userType === 'Driver') {
        return next();
    } else {
        return res.status(403).send('Access denied: Only drivers can access this page.');
    }
};
