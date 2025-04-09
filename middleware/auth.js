import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {

//     const { token } = req.headers;

//     if (!token) {
//         return res.json({ success: false, message: 'Not Authorized Login Again' })
//     }

//     try {

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId = token_decode.id
//         next()

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }

// }

// export default authUser

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id; // Attach userId to the request body
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
