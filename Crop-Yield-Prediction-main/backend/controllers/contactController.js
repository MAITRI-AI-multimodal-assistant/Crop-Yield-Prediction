import Contact from "../models/Contact.js";

export const sendContact = async (req, res) => {
    try {

        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const contact = new Contact({
            name,
            email,
            phone,
            message
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};