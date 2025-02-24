require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET Loaded:", !!JWT_SECRET); // Check if secret is loaded

module.exports = async function (context, req) {
    try {
        console.log("Incoming Request:", req);

        if (!req.body || typeof req.body !== "object") {
            console.error("Invalid Request Body:", req.body);
            context.res = { status: 400, body: "Invalid JSON body" };
            return;
        }

        const { username } = req.body;
        if (!username) {
            console.error("Missing Username in Request");
            context.res = { status: 400, body: "Username required" };
            return;
        }

        console.log("Generating token for user:", username);
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

        console.log("Token Generated Successfully:", token);
        context.res = { status: 200, body: { token } };
    } catch (error) {
        console.error("Error in login function:", error);
        context.res = { status: 500, body: `Internal Server Error: ${error.message}` };
    }
};
