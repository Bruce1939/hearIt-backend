const { Schema, model } = require('mongoose');

const userModel = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isCreator: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationCode: {
        type: Number,
        default: 000000
    }
},{
    timestamps: true
});

const User = model('User', userModel);

module.exports = User;