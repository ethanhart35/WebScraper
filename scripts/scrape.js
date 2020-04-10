var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb){
    request("https://www.nytimes.com/", function(err, res, body){
        var $ = cheerio.load(body);
        var articles = [];

        $(".theme-summary").each(function(i, element){
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();

            if(head && sum){
                var addData = {
                    headline: head,
                    summary: sum
                };
                articles.push(addData);
            };
        });
        cb(articles);
    });
};