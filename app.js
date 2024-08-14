const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection string from MongoDB Atlas
const mongoURI = 'mongodb+srv://milanpatel8045:Milan%402299@cluster0.rn6w1x3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000 // Set the server selection timeout to 5 seconds
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if unable to connect to MongoDB
    });

// Routes
app.get('/', (req, res) => {
    res.redirect('/dashboard'); // Redirect to /dashboard or you can render it directly
});

app.get('/dashboard', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user, isFirstTimeLogin: user.firstName === 'N/A' && user.lastName === 'N/A' });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.use('/', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
