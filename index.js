const http = require("http");
var express = require('express');
var path = require('path');
const fs = require("fs");
const requests = require("requests");
const {
    parse
} = require("path/posix");
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
    requests("http://api.openweathermap.org/data/2.5/weather?q=sikar&appid=2d42aeb3df951886352515d6a43c754b").on("data", (chunk) => {
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