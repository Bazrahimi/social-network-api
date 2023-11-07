const User = require('../models/User');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    }catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

    // create a new user
    async createUser(req, res) {
      try {
        const dbUserData = await User.create(req.body);
        res.json(dbUserData);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // update user by ID
    async updateUser(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId }, // find a document by ID
          req.body, // update document with data from req.body
          { 
            new: true, // return the updated document
            runValidators: true // run validators for the update operation
          }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

}