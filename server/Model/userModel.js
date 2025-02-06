const mongoose = require('mongoose');

const Schema = mongoose.Schema

const subscribersSchema = new Schema({
    name: {
        type: String
    },

    email: {
        type: String
    },

    preferences: {
        tone: { 
            type: String, 
            enum: ["motivational", "inspirational", "funny"], 
            required: true 
        },

        interests: { 
            type: [String], 
            required: true 
        },
    },

    subscriptionStart: {
        type: String
    },

    nextSendDate: {
        type: String
    },
});

const Subscriber = mongoose.model('Subscribers', subscribersSchema);

module.exports = Subscriber;