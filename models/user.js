const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: 'N/A',
        required: true
    },
    lastName: {
        type: String,
        default: 'N/A',
        required: true
    },
    age: {
        type: Number,
        default: 0,
        required: true
    },
    licenseNumber: {
        type: String,
        default: 'N/A',
        required: true
    },
    carDetails: {
        make: {
            type: String,
            default: 'N/A',
            required: true
        },
        model: {
            type: String,
            default: 'N/A',
            required: true
        },
        year: {
            type: Number,
            default: 0,
            required: true
        },
        plateNumber: {
            type: String,
            default: 'N/A',
            required: true
        }
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Driver', 'Examiner', 'Admin'],
        required: true
    }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
