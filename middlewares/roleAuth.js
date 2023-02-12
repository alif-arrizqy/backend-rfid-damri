const roleAuth = (whoCanAcsess) => {
    return function (req, res, next) {
        try {
            if (whoCanAcsess.includes(req.jwt.role)) {
                next()
            }
            else {
                throw { 'message': 'UNAUTHORIZED_ROLE' }
            }
        }
        catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default roleAuth