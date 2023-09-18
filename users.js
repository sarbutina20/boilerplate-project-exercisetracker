// I want to implement adding users to MongoDB Atlas database.
const mongoose = require("mongoose");
const { User, Logs } = require("./modeli.js");

class Users {
  addUser(req, res) {
    const username = req.body.username;
    const newUser = new User({ username, log: [] });
    const newLog = new Logs({
      _id: newUser._id,
      username,
      count: 0,
      log: [],
    });

    newLog.save();

    newUser
      .save()
      .then(() => res.json(newUser))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
  }
}

module.exports = { Users: new Users(), User };
