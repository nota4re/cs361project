var express = require('express');
//var mysql = require('./localdb.js');    //DB CONFIG FILE NAME HERE
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var handlebars = require('express-handlebars').create({ defaultLayout: 'mainpage' });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3000);   //here is the port #, adjust as needed

app.use('/', router);
// sample data block
var time = new Date();
var id = 0;
function Post(fname, lname, content) {
    this.author_fname = fname;
    this.author_lname = lname;
    var curTime = new Date();
    this.time = curTime.toString();
    this.content = content;
    this.id = id;
    id++;
    this.comment_arr = []
}

var post1 = new Post("John", "Smith", "Today was little James' birthday!");
var post2 = new Post("Jane", "Smith", "James' first day of school!");

var postarray = [];
postarray.push(post1);
postarray.push(post2);
function addPost(req)
{
    var time = new Date();
    var newPost = new Post(req.body.fname, req.body.lname, req.body.content);
    postarray.push(newPost);
}
//method that deletes the Post at given index of postarray
function deletePost(index)
{   
    postarray.splice(index, 1);
    for(var i = index; i < postarray.length; i++)
    {
        postarray[i].id -= 1;
    }
    id = postarray.length;

}

function addComment(index, comment)
{
    postarray[index].comment_arr.push(comment);
}
//display all posts so far
router.get('/', function(req, res){
    var context = {};
    context.Post = postarray;
    res.render('mainpage', context);


})
//handler that adds post
router.post('/', function(req, res){
    addPost(req);
//    console.log("post received!\n")
    console.log(postarray);
    res.redirect('/');
})
//this handler will add comments to a given post
router.post('/:id', function(req, res){
    var index = req.params.id;
    var content = req.body.content;
    addComment(index, content);

    res.redirect('/');

})

//delete post handler
router.delete('/:id', function(req, res){
    var post_id = req.params.id;
 //   console.log(req.params.id);
 //   console.log("id = " + post_id);
    deletePost(post_id);
   
   // console.log(postarray)
    res.status(202).end();


})



app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
