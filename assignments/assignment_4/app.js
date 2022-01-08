const express = require('express');
const path = require('path');
const faker = require("faker");
const ejs = require('ejs');
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const userdb = require('./model/model')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/assignment_4');

const app = express();
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, }));

const port = 3000
const hostname = 'localhost'

// setting up template engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

var users = []

app.get("/", async (req, res) => {
    var data = await userdb.find();
    res.render("index", { data });
});

app.put("/users/:id/", async (req, res) => {
    await userdb.updateOne({ _id: req.params.id }, [
        { $set: { isPromoted: { $not: "$isPromoted" } } },
    ]);
    res.redirect("/");
});

app.get('/form', (req, res) => {
    res.render('form')
})

app.post('/users/add',async (req, res) => {
    newuser = {
        name: req.body.name,
        email: req.body.email,
        isPromoted: null
    };
    await userdb.create(newuser);
    res.redirect('/')
})

app.delete("/users/:id/", async (req, res) => {
    await userdb.deleteOne({ _id: req.params.id });
    res.redirect("/");
});



app.listen(port, ()=>{
    console.log('listening')
});