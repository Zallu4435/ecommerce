const mongoose = require('mongoose');
require('dotenv').config({ path: 'config/.env' });

const Order = require('./model/Orders');

const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
            checkOrders();
        })
        .catch((err) => {
            console.log(err);
        });
};

const checkOrders = async () => {
    try {
        const orderCount = await Order.countDocuments();
        console.log(`Total Orders in DB: ${orderCount}`);

        if (orderCount > 0) {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
            console.log('Recent Orders:', JSON.stringify(orders, null, 2));
        } else {
            console.log("No orders found in the database.");
        }
    } catch (error) {
        console.error('Error checking orders:', error);
    } finally {
        mongoose.disconnect();
    }
};

connectDatabase();
