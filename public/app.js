$(document).ready(function () {

$.getJSON("/articles", function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].author + "</p>" + "<br /><p id='"+ data[i].comment._id + "'>" + data[i].comment + "</p>");
      $("#articles").append("<form> Username: <br> <input type='text' name='userName' id='userName'><br> Comment: <br> <input type='text' name='comment'id='comment'><br><input type='submit'id='submit'></form>")
      for(var i = 0; i <data.comment.length; i++){
        $("#commentsDiv").append("<button id='delete'>Delete</button>");
      }
    }
});

$("#submit").on("click", function(e){
  e.preventDefault();
  console.log("clicked");
  var newComment = {
    user: $("#userName").val(),
    comment: $("#comment").val(),
  };
  console.log(newComment);
  var id = $(this)._id;
  $.post("/articles/"+ id, newComment, function (data){
    console.log("New comment: "+ data)
  }).then($.get("/", function(data){
    $("body").html(data);
  }));
});

$("#delete").on("click", function(commentId){
  $(commentId).remove();
})
});