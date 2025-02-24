require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

module.exports = async function (context, req) {
    const { username } = req.body;
    if (!username) {
        context.res = { status: 400, body: "Username required" };
        return;
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    context.res = { body: { token } };
};
