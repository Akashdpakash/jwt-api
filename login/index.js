require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

module.exports = async function (context, req) {
    try {
        console.log("JWT_SECRET:", JWT_SECRET); // Log to check if it's loaded

        const { username } = req.body;
        if (!username) {
            context.res = { status: 400, body: "Username required" };
            return;
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        context.res = { body: { token } };
    } catch (error) {
        console.error("Error in login function:", error);
        context.res = { status: 500, body: `Internal Server Error: ${error.message}` };
    }
};
