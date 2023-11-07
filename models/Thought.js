const { Schema, model } = require('mongoose');
const moment = require('moment');

const ThoughtSchema = new Schema({
  thought: {
    type: String,
    required: true,
    minlength: [1, 'Thought must be at least 1 character long.'],
    maxlength: [280, 'Thought must be at most 280 characters.'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets default value to the current timestamp
    get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a') // Formats the timestamp on query
  },
  username: {
    type: String,
    required: true, 
  },
  reactions: [ReactionSchema] // Array of nested documents created with the reactionSchema
}, {
  toJSON: {
    getters: true
  }
});


const Thought = model('thought', ThoughtSchema);

module.exports = Thought;