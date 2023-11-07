const { User, Thought } = require('../models');

module.exports = {
  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single thought by its _id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
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
    const thoughtId = req.params.thoughtId;

    // Find the thought and make sure it exists
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    await User.findOneAndUpdate(
      { username: thought.username }, // Find the user by the unique username
      { $pull: { thoughts: thoughtId } }, // 
      { new: true }
    );

    // Now, delete the thought document
    await Thought.findByIdAndDelete(thoughtId);
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    console.error('Error deleting thought:', err);
    res.status(500).json(err);
  }
}






};
