const mongoose = require('mongoose');

const UserSchama = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        unique: true,
        true: true,
    },

    email : {
        type : String,
        required: true,
        unique: true,
        true: true,
        lowercase: true,
    },
    password : {
        type: String,
        required: true,
    },
    role : {
        type : String,
        enum : ['user', 'admin'], 
        default : 'user',
    },

}, {timestamps : true})

module.exports = mongoose.model('User',UserSchama);