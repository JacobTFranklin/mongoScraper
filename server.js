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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
  });

//Scrape route
app.get("/scrape", function(req, res) {
    axios.get("https://www.golfdigest.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("div.feature-item-content").each(function(i, element){
            var result = {};
            //Collect result data
            result.title = $(this)[0].children[2].children[0].firstChild.data;
            var link = $(this)[0].children[2].attribs.href;
            if(!link.includes("golfdigest.com")){
                result.link = "https://www.golfdigest.com" + $(this)[0].children[2].attribs.href;
            }
            else{
                result.link = $(this)[0].children[2].attribs.href;
            };
            result.author = $(this)[0].children[3].children[0].children[2].children[0].childNodes[0].data;
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

//Retrieve articles route
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });