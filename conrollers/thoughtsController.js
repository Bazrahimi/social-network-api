const { User, Thought } = require('../models');

module.exports = {
  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single thought by its _id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to create a new thought
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: newThought._id } },
        { new: true }
      );
      res.json(newThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT to update a thought by its _id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to remove a thought by its _id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }

      // Remove the thought from the user's `thoughts` array
      await User.findByIdAndUpdate(
        thought.username, // Assuming 'username' is the User's unique identifier. Otherwise, use the appropriate user identifier
        { $pull: { thoughts: thought._id } },
        { new: true }
      );

      // Delete the thought document
      await thought.remove();
      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
