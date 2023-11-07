const mongoose = require('mongoose');
const { User, Thought } = require('../models'); 
const connection = require('../config/connection');
const { userSeedData } = require('./data');

connection.on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

connection.once('open', async () => {
  console.log('connected');

  try {
    // Clear the User collection
    await User.deleteMany({});
    console.log('Users collection cleared');


    // Insert the seed user data
    const users = await User.insertMany(userSeedData);
    console.log('Users seeded successfully:', users);

    // If you have thoughtSeedData or reactionSeedData, you would seed them here similarly

    // Optional: Close the connection once seeding is complete
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
});
