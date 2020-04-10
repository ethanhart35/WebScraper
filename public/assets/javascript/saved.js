$(document).ready(function(){

$(document).on("click", ".btn.delete", handleArticleDelete);
$(document).on("click", ".btn.notes", handleArticleNotes);
$(document).on("click", ".btn.save", handleNoteSave);
$(document).on("click", ".btn.note-delete", handleNoteDelete);

initPage();

function initPage(){
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
    .then(function(data){
        if (data && data.length){
            renderArticles(data);
        }
        else{
            renderEmpty();
        }
    });
}
function renderArticles(articles){
    var articlePanels = [];

    for(var i=0; i<articles.length; i++){
        articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
}

function createPanel(article){
    var panel = $(["<div class ='panel panel-default'>",
    "<div class ='panel-heading'>",
    "<h3>",
    article.headline,
    "<a class = 'btn btn-success save'>",
    "</a>",
    "</h3>",
    "</div>",
    "<div class ='panel-body'>",
    article.summary,
    "</div>",
    "</div>"
].join(""));
panel.data("_id", article._id);
return panel;
}

function renderEmpty(){
    var emptyAlert = $([
        "<div class = 'aler alert-warning text-center'>",
        "<h4>No new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What do you want to do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'> Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
    ].join(""));
    articleContainer.append(emptyAlert);
}

function handleArticleDelete(){
    var articletToDelete = $(this).parents(".panel").data();
    $.ajax({
        method: "DELETE",
        url: "/api/headlines/" + articletToDelete._id
    }).then(function(data){
        if(data.ok){
            initPage();
        }
    });
}





})