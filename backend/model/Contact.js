const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        message: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Contact', contactSchema);