const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  log: [
    {
      _id : {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
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
        }
      ],
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
  _id: {
    type: String,
    required: true,
  },
});

const Exercise = mongoose.model("Exercise", ExerciseScheme);

const LogsScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0,
  },
  _id : {
    type: String,
    required: true
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
    }
  ],
});

const Logs = mongoose.model("Logs", LogsScheme);


module.exports = { User, Exercise, Logs };
