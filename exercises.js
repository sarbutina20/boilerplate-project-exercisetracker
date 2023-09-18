const mongoose = require("mongoose");
const { Exercise, User, Logs } = require("./modeli.js");

class Exercises {
  async addExercise(req, res) {
    const description = req.body.description;
    const duration = Number(req.body.duration);
    let date = req.body.date;
    const id = req.params._id;

    if (!date) {
      date = new Date().toDateString();
    } else {
      date = new Date(date).toDateString(); 
    }
    // My date needs to be in the format: Sun Jan 03 2021
    
    if(!date) {
      date = new Date().toDateString();
    }
    else {
      date = new Date(date).toDateString();
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(400).json("Error: User not found");
      return;
    }

    try {
      const newExercise = new Exercise({
        _id: id,
        username: user.username,
        description,
        duration,
        date,
      });

      newExercise.save();

      Logs.findById(id).then((logs) => {
        logs.count = logs.count + 1;
        logs.log.push({
          description,
          duration,
          date,
        });
        logs.save();
      });
      res.json(newExercise);
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
