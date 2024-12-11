const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        // const mongoUri = "mongodb://localhost:27017/ecommerce"
        // console.log(process.env.MONGO_URI, 'mmmmmmm');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfuly');
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }; 
};


module.exports = connectDatabase;
 