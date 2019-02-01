//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;

//Initialize Express
var app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB using Mongoose 
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });

//Scrape route
app.get("/scrape", function(req, res) {
    axios.get("https://www.golfdigest.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("h3.feature-item-hed").each(function(i, element){
            var result = {};
            //Collect result data
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");
            //Creates new DB object
            db.Article.create(result)
            .then(function(dbArticle) {
            console.log(dbArticle);
            })
            .catch(function(err) {
            console.log(err);
            });
        });
    res.send("Scrape Complete");
  });
});
