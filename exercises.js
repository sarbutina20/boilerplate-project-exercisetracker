const mongoose = require("mongoose");
const {Exercise, User} = require("./modeli.js");

class Exercises {
    addExercise(req, res) {
        const username = req.body.username;
        const description = req.body.description;
        const duration = Number(req.body.duration);
        const date = Date.parse(req.body.date);
        if(!date) {
            date = Date.now();
        }
        const newExercise = new Exercise({
            username,
            description,
            duration,
            date,
        });
        newExercise.save()

        User.findOne({username: username}, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                user.count++;
                user.log.push(newExercise);
                user.save()
                .then(() => res.json(user))
                .catch((err) => res.status(400).json("Error: " + err));
            }
        });

    }
}

module.exports = {Exercises: new Exercises()};