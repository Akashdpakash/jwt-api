require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

function authenticateToken(req) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return { status: 401, body: "Access Denied" };

    try {
        const token = authHeader.replace("Bearer ", "");
        const user = jwt.verify(token, JWT_SECRET);
        return { status: 200, user };
    } catch (err) {
        return { status: 403, body: "Invalid Token" };
    }
}

module.exports = async function (context, req) {
    const authResult = authenticateToken(req);
    if (authResult.status !== 200) {
        context.res = { status: authResult.status, body: authResult.body };
        return;
    }

    context.res = { body: { message: `Hello, ${authResult.user.username}!` } };
};
