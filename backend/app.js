const express = require('express');
const ErrorHandler = require('./middleware/error');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config({
    path:"./config/.env"
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://10.0.15.86:5173"],
    credentials: true
}));
app.use('/', express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));

// CONFIG
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({
        path: "backend/config/.env"
    });
};

// Routes
const routes = require('./routes/index');
app.use("/api", routes); 

app.use(ErrorHandler);
// Error Handler (must be the last middleware)
// app.use((err, req, res, next) => {
//     if (err instanceof ErrorHandler) {
//         return res.status(err.statusCode).json({
//             success: false,
//             message: err.message
//         });
//     }
//     // Default error handler
//     res.status(500).json({
//         success: false,
//         message: 'Internal Server Error'
//     });
// });

module.exports = app; 
