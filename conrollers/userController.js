const { User, Thought } = require('../models');


module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate('thoughts')
        .populate('friends');
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

    // Delete a user by ID and their associated thoughts
    async deleteUser(req, res) {
      try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID to delete' });
        }
    
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
    
        // Now delete the user
        await User.findByIdAndDelete(userId);
    
        res.json({ message: 'User and associated thoughts deleted' });
      } catch (err) {
        console.error('Error deleting user:', err); // Log the error for debugging
        res.status(500).json(err);
      }
    },

    async addFriend(req, res) {
      try {
        const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $addToSet: { friends: req.params.friendId } }, // Use $addToSet to avoid duplicates
          { new: true, runValidators: true }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
  
    // Remove a friend from a user's friend list
    async removeFriend(req, res) {
      try {
        const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $pull: { friends: req.params.friendId } }, // Use $pull to remove a friend
          { new: true }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    
};

