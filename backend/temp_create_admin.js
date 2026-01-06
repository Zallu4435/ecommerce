const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "config/.env"),
});
const User = require("./model/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const email = "admin@example.com";
        let user = await User.findOne({ email });

        if (user) {
            user.role = "admin";
            user.status = "active";
            user.password = "password123";
            await user.save();
            console.log("Admin user updated with password: password123");
        } else {
            user = await User.create({
                email,
                password: "password123",
                username: "Admin User",
                role: "admin",
                status: "active"
            });
            console.log("Admin user created: admin@example.com / password123");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

createAdmin();
