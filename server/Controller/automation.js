const axios = require('axios');
require('dotenv').config();

const composeMessage = async (message, tone, interest) => {
    try {
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.openai_api_key}`,
                "Content-Type": "application/json",
            },
            data: {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant called "Wordy Gift" who provides guidance and motivation to users. Your responses should be tailored to each user's preferred tone and interests.
                        - **Tone:** Adjust your response to match the user's preferred tone (e.g., casual, professional, enthusiastic). Here is the user's preferred tone ${tone}
                        - **Interest:** Relate the message to the user's specific interest to make it relevant and engaging. Here is the user's preferred interest ${interest}
                        Keep responses concise, encouraging, and practical. Avoid generic advice—personalize the message based on context.`
                    },
                    { role: "user", content: message }
                ],
                max_tokens: 1000,
            },
        };

        const response = await axios.post("https://api.openai.com/v1/chat/completions", options);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error composing AI message:", error);
        return "I'm unable to send your message right now.";
    }
};

const sendSMS = async (phone, message ) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        console.log(`Message sent to ${phone}: ${response.sid}`);
        return response;
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}

module.exports = {composeMessage, sendSMS};