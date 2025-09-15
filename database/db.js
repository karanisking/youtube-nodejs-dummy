const mongoose = require('mongoose');

const connectToDB = async() => {
    try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB is connected');
    } catch(e){
        console.log(`The error in connecting DB is ${e}`);
        process.exit(1);
    }
}

module.exports = connectToDB;