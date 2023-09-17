const {Users } = require("./users.js")
const {Exercises} = require("./exercises.js")
const mongoose = require('mongoose');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", Users.addUser);
app.get("/api/users", Users.getUsers); 

app.post("/api/users/:_id/exercises", Exercises.addExercise);
app.get("/api/users/:_id/exercises", Exercises.getExercises);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
