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
    const { from, to, limit } = req.query;

    const filter = { _id: id };
    if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("Error: User not found");
    }

    const logs = await Logs.findOne(filter)
      .limit(parseInt(limit) || undefined)
      .exec();

    // Konvertirajte datume u odgovarajući format
    if (logs && logs.log) {
      logs.log = logs.log.map((logEntry) => ({
        description: logEntry.description,
        duration: logEntry.duration,
        date: new Date(logEntry.date).toDateString(), // Konvertirajte datum
      }));
    }

    res.json({
      _id: user._id,
      username: user.username,
      count: logs ? logs.count : 0,
      log: logs ? logs.log : [],
    });
  }
}

module.exports = { Exercises: new Exercises() };
