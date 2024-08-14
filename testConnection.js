const mongoose = require('mongoose');

// MongoDB connection string from MongoDB Atlas
const mongoURI = 'mongodb+srv://milanpatel8045:Milan%402299@cluster0.rn6w1x3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000 // Set the server selection timeout to 5 seconds
})
    .then(() => {
        console.log('MongoDB connected');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
