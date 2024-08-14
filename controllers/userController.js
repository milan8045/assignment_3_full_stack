const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { username, password, repeatPassword, userType } = req.body;
    if (password !== repeatPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const user = new User({
            username,
            password,
            userType
        });
        await user.save();
        res.render('login', { success: 'Sign up successful! Please log in.' });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        // Set a flag for first time login
        const isFirstTimeLogin = user.firstName === 'N/A' && user.lastName === 'N/A';

        // Set up session or JWT here if needed
        req.session.user = user;

        if (user.userType === 'Driver') {
            res.render('dashboard', { user, isFirstTimeLogin });
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.addG2User = async (req, res) => {
    const { firstName, lastName, age, licenseNumber, make, model, year, plateNumber } = req.body;
    const username = req.session.user.username; // Assuming the user is logged in and we are updating their details
    try {
        const user = await User.findOneAndUpdate(
            { username: username },
            {
                $set: {
                    firstName,
                    lastName,
                    age,
                    licenseNumber,
                    carDetails: {
                        make,
                        model,
                        year,
                        plateNumber
                    }
                }
            },
            { new: true, runValidators: true }
        );
        res.status(201).send('User updated');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getUser = async (req, res) => {
    const { licenseNumber } = req.body;
    try {
        const user = await User.findOne({ licenseNumber });
        if (user) {
            res.render('g', { user, error: null });
        } else {
            res.render('g', { user: null, error: 'No User Found' });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateCar = async (req, res) => {
    const { licenseNumber, make, model, year, plateNumber } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { licenseNumber },
            {
                $set: {
                    'carDetails.make': make,
                    'carDetails.model': model,
                    'carDetails.year': year,
                    'carDetails.plateNumber': plateNumber
                }
            },
            { new: true, runValidators: true }
        );
        if (user) {
            res.render('g', { user, error: null });
        } else {
            res.render('g', { user: null, error: 'No User Found' });
        }
    } catch ( err) {
        res.status(500).send('Server error');
    }
};
