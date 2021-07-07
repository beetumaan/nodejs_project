const http = require("http");
var express = require('express');
var path = require('path');
const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/maan", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected successfully..."))
    .catch((err) => console.log(err));


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    active: Boolean,
    rate: Number,
    tuter: {
        type: String,
        required: true,
        enum: ["thappa technical", "bucky", "beetu", "self"]
    },
    date: {
        type: Date,
        default: Date.now
    }
})



const Skill = new mongoose.model("Skill", courseSchema);

const creatdoc = async() => {
    try {
        const php = new Skill({
            name: "php",
            active: true,
            rate: 20,
            tuter: "beetu"
        })
        const express = new Skill({
            name: "express",
            active: true,
            rate: 60,
            tuter: "thappa technical"
        })
        const mongodb = new Skill({
            name: "mongodb",
            active: true,
            rate: 50,
            tuter: "thappa technical"
        })
        const python = new Skill({
            name: "python",
            active: true,
            rate: 30,
            tuter: "thappa technical"
        })

        const res = await Skill.insertMany([php]);
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

creatdoc();
const getDoc = async() => {
    const res = await Skill.find()
        .find({ $or: [{ tutor: "thappa technical" }, { rate: { $gte: 30 } }] })
        .select({ name: 1 })
        .sort({ name: 1 });
    console.log(res);
}

//getDoc();

const updateDoc = async(_id) => {
    try {
        const res = await Skill.updateOne({ _id }, {
            $set: {
                tuter: "beetu"
            }
        })
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

//updateDoc("60e58c03672d272158b144c9");

const deleteDoc = async(_id) => {
    try {
        const res = await Skill.deleteOne({ _id })
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

//deleteDoc("60e58c03672d272158b144c9");



const requests = require("requests");
// const {
//     parse
// } = require("path/posix");
// const { Console } = require("console");

const port = process.env.PORT || 8000;
const app = express();
app.use(express.static("public"));
console.log(__dirname);

function tocel(temp) {
    var a = parseInt(temp);
    console.log(a);
    var c = (a - 273.15);
    return c.toFixed(2);
}
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
    requests("http://api.openweathermap.org/data/2.5/weather?q=jhunjhunu&appid=2d42aeb3df951886352515d6a43c754b").on("data", (chunk) => {
        const arr = JSON.parse(chunk);
        const arrdata = [arr];
        // console.log(tocel(98.7));
        res.render("index", {
            location: arrdata[0].name,
            country: arrdata[0].sys.country,
            temp: tocel(arrdata[0].main.temp),
            temp_max: tocel(arrdata[0].main.temp_max),
            temp_min: tocel(arrdata[0].main.temp_min)
        });
    }).on("end", function(err) {
        if (err) return console.log("connection closed due to errors", err);
        console.log("end");
        res.end();
    });
})


app.listen(port, function() {
    console.log("running");
})