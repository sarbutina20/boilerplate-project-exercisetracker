const mongoose = require("mongoose");
const { Exercise, User, Logs } = require("./modeli.js");

class Exercises {
  async addExercise(req, res) {
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const id = req.params._id;
    const receivedDate = req.body.date;
    let date;
    if (!receivedDate) {
      date = new Date().toDateString();
    } else {
      date = new Date(receivedDate).toDateString();
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(400).json("Error: User not found");
      return;
    }

    try {
      const newExercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        user_id: id,
        username: user.username,
        description,
        duration,
        date,
      });

      const responseExercise = {
        _id: newExercise.user_id,
        username: newExercise.username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: new Date(newExercise.date).toDateString(),
      };

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
      res.json(responseExercise);
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  }

  async getExercises(req, res) {
    const id = req.params._id;
    const { from, to, limit } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("Error: User not found");
    }
    try {
      Logs.findById(id).then((logs) => {
        if (logs) {
          logs.log = logs.log.map((logEntry) => ({
            description: logEntry.description,
            duration: logEntry.duration,
            date: new Date(logEntry.date).toDateString(),
          }));

          if (from) {
            const fromDate = new Date(from);
            logs.log = logs.log.filter((logEntry) => {
              const logDate = new Date(logEntry.date);
              return logDate >= fromDate;
            });
          }

          if (to) {
            const toDate = new Date(to);
            logs.log = logs.log.filter((logEntry) => {
              const logDate = new Date(logEntry.date);
              return logDate <= toDate;
            });
          }

          if (limit) {
            logs.log = logs.log.slice(0, limit);
          }

          res.json({
            _id: user._id,
            username: user.username,
            from: from ? new Date(from).toDateString() : undefined,
            to: to ? new Date(to).toDateString() : undefined,
            count: logs.log.length,
            log: logs.log,
          });
        }
      });
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  }
}

module.exports = { Exercises: new Exercises() };
