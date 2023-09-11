const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  log: [
    {
      description: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
        min: 1,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const User = mongoose.model("User", UserScheme);

const ExerciseScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Exercise = mongoose.model("Exercise", ExerciseScheme);

module.exports = { User, Exercise };
