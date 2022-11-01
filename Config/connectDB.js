const mongoose = require('mongoose');
const { MONGO_URI } = require('./../Constants/index');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connected to mongodb');
    } catch (error) {
        console.log(err);
    }
}

module.exports = connectDB;