var express = require("express");
var mongoose = require("mongoose");

var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;

var app = express();


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


//ROUTES BELOW

app.get("/scrape", function(req,res){
    axios.get("http://www.echojs.com/").then(function(response){
        var $ = cheerio.load(response.data);
        $("article h2").each(function(i, element){
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});
app.get("/", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        console.log(dbArticle);
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){

        var articleobj={
            temp:dbArticle.map(function(document){
                return{
                    title: document.title
                }
            })
        }
        console.log(articleobj);
        res.render("index", {articleobj: articleobj.temp});
    }).catch(function(err){
        res.json(err);
    });
});


app.get("/articles/:id", function(req,res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });




// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });