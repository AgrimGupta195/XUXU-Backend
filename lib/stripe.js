const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

exports.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);