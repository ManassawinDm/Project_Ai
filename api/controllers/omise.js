require('dotenv').config()
const db = require("../db.js");
var omise = require('omise')({
    'publicKey': process.env.VITE_OMISE_PUBLIC_KEY,
    'secretKey': process.env.VITE_OMISE_SECRET_KEY
});

const Omisepayment = async (req, res, next) => {
    const { email, amount, token, port_id, selectedTransactions } = req.body;

    try {
        const customer = await omise.customers.create({
            email,
            description: port_id,
            card: token
        });

        const charge = await omise.charges.create({
            amount: amount,
            currency: "thb",
            customer: customer.id
        });

        if (charge.status === 'successful' && selectedTransactions.length > 0) {
            const placeholders = selectedTransactions.map(() => '?').join(',');
            const sql = `UPDATE transaction SET Status = 1 WHERE Transaction_ID IN (${placeholders})`;

            await db.query(sql, selectedTransactions);
        }

        res.status(200).send({
            amount: charge.amount,
            status: charge.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred during the payment process." });
    }
    next();
};
module.exports = Omisepayment;