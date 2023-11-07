const { User, Thought, Reaction } = require('../models');

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
  },

    // Post to create a reaction store in a single thought
    async addReaction(req, res) {
      try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this ID' });
        }
        
        // Create a new Reaction document from req.body
        const reaction = new Reaction(req.body);
        await reaction.save(); // Save the new reaction document
    
        // Now push the _id of the new Reaction document, not the whole object
        thought.reactions.push(reaction._id);
        await thought.save(); // Save the thought with the new reaction id
    
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    

    

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } }, // Use reactionId to identify which reaction to remove
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID or reaction cannot be found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },






};
