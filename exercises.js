const mongoose = require("mongoose");
const { Exercise, User, Logs } = require("./modeli.js");

class Exercises {
  async addExercise(req, res) {
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);
    const id = req.params._id;

    if (!date) {
      date = Date.now().toString();
    }

    const user = await User.findById(id);

    if(!user) {
        res.status(400).json("Error: User not found");
        return;
    }

    try {
      const newLog = new Logs({
        username: user.username,
        count: 1,
        _id: id,
        log: [
          {
            description,
            duration,
            date,
          },
        ],
      });

      newLog.save();

      res.json(newLog);
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  }

  async getExercises(req, res) {
    const id = req.params._id;
    Logs.findById(id)
      .then((logs) => res.json(logs))
      .catch((err) => res.status(400).json("Error: " + err));
  }
}

module.exports = { Exercises: new Exercises() };
