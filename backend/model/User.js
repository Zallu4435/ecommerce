const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    address: [
        {
            country: {
                type: String
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {  
                type: String, 
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        }
    ],
    role: {
        type: String,
        default: 'user',
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});


// Hash Password
userSchema.pre("save", async function(next) { 
    if (!this.isModified("password")) {
        next();
    };

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// jwt Token
userSchema.methods.getJwtToken = function() { 
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// Compare Passwords
userSchema.methods.comparePassword = async function(enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
