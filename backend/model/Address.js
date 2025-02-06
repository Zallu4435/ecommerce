const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        country: {
            type: String,
            default: 'India'
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Address', addressSchema)