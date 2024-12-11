const express = require('express');
const router = express.Router();  // Correct Router initialization
const User = require('../model/User');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const { isAthenticated } = require('../middleware/auth');

// POST route to create a user
router.post('/create-user', async (req, res, next) => { 
    try {
        const { username, email, password, phone } = req.body;
    
        const userEmail = await User.findOne({ email });
    
        if (userEmail) {
            return next(new ErrorHandler("User already exists.", 400));
        }
    
        const user = {
            username,
            email,
            password,
            phone
        };

        console.log(user, "user")
    
        const activationToken = createActivationToken(user);      
        const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.username}, Please click on the link to activate your account: ${activationUrl}`,
            })
            res.status(201).json({
                success: true,
                message: `Please check your email:- ${user.email} to activate your account.` 
            })
        } catch (err) {
            return next(new ErrorHandler(err.message,500));
        }

    } catch (err) {
        return next(new ErrorHandler(err.message,400));
    }


});


// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: "5m"
    })
}


// activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        const newUser = jwt.verify(activation_token, process.env.JWT_SECRET_KEY);

        if (!newUser) {
            console.log('inside ythe if ')
            return next(new ErrorHandler("Invalid user", 400));
        }

        const { username, email, password, phone } = newUser;

        let user = await User.findOne({ email });

        if (user) {
            return next(new ErrorHandler('User already exists', 400));
        }

        user = await User.create({
            username, email, password, phone
        });


        sendToken(user, 201, res);
    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
}));


router.post('/login-user', catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // console.log(email, password, "hahahhahha")

        if(!email || !password) {
            return next(new ErrorHandler("please provide the all fields!", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if(!user) {
            return next(new ErrorHandler("User doesn't exists!", 400))
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid) {
            return next(new ErrorHandler('Please provide the correct information', 400));
        };

        sendToken(user, 201, res);

    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}));

// Load user route
router.get('/getUser', isAthenticated, catchAsyncErrors( async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400))
        };

        res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return next(new ErrorHandler(err.message, 500))
    }
}));


module.exports = router;
