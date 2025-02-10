const axios = require('axios');
const Subscriber = require('../Model/userModel');
const {composeMessage, sendSMS} = require('../Controller/automation')
require('dotenv').config();

const stripe = require('stripe')(process.env.stripe_api_key);

let userCurrentPlan;

const subscribeWithStripe = async (req, res, next) => {
    const { subscriptionName, subscriptionPrice } = req.body

    console.log(req.body);

    try {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: subscriptionName === "moreMessages" ? 'Send more than one uplifting messages per month for 12months' : 'Send one uplifting messages per month for 12months',
                        },
                        unit_amount: subscriptionPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:3000/?payment=true",
            cancel_url: "http://localhost:3000/?payment=false",
        });

        res.json({ url: session.url, sessionID: session.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const saveSubscriberToDb = async (req, res, next) => {
    console.log('request received!')
    try {
        const { name, phone, tone, interest, birthdate} = req.body;

        const subDate = new Date();
        const day = subDate.getDate();
        const month = subDate.getMonth();
        const year = subDate.getFullYear();

        console.log(name, phone, tone, interest, day, month, year);

        if (!name || !phone || !tone || !interest) {
            return res.status(400).json({ message: "Name and Email are required." });
        }

        const newSubscriber = new Subscriber({
            name,
            phone,
            preferences: {
                tone, 
                interest
            },
            nextSendDate: birthdate,
            subscriptionStart: `${day}-${month}-${year}`,
        });

        await newSubscriber.save();

        res.status(201).json({ message: "User Stored Successfully" });

    } catch (error) {
        console.error("Error saving subscriber:", error);
        res.status(500).json({ message: "An error occurred while saving the subscriber." });
    }
};

const checkAndSendMessages = async () => {
    const today = new Date();
    const todayDay = String(today.getDate()).padStart(2, "0"); // Get the day (DD)

    try {
        // Fetch users where nextSendDate ends with "-DD"
        const users = await Subscriber.find({
            nextSendDate: { $regex: `-${todayDay}$` }
        });

        if (users.length === 0) {
            console.log("No users found with today's day.");
            return;
        }

        // Send messages to the matching users
        for (const user of users) {
            try {
                // Compose a message based on user's tone and interest
                const userMessage = `Hey ${user.name}, here's something for you today on ${user.interest}. Let's make progress!`; 
                
                const aiMessage = await composeMessage(userMessage, user.tone, user.interest);
                
                // Send the AI-generated message
                await sendSMS(user.phone, aiMessage);
                
                console.log(`Message sent to ${user.phone}`);
            } catch (err) {
                console.error(`Failed to send message to ${user.phone}:`, err);
            }
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};


module.exports = { saveSubscriberToDb, subscribeWithStripe, checkAndSendMessages };