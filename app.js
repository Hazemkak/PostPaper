//jshint esversion:6

var _ = require('lodash');

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const errorHead="Error Page Not Found";
const errorBody="It seems like you entered an unknown url address";

mongoose.connect("mongodb+srv://hazemkak:kasim123@cluster1.yalzc.mongodb.net/BlogDB",{useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false });

const PostSchema={
  title:String,
  content:String
};

const Post=mongoose.model("post",PostSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  Post.find({},function(err,results){
    if(!err){
      res.render("home",{
        HOME:homeStartingContent,
        POST:results
      });
    }
    else{
      console.log(err);
    }
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
    CONTACT:contactContent
  });
});

app.get("/about",function(req,res){
  res.render("about",{
    ABOUT:aboutContent
  });
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const newItem=new Post({
    title:req.body.postTitles,
    content:req.body.postWords
  });
  newItem.save();
  console.log("The post is saved to Database");
  res.redirect("/");
});


app.get("/posts/:topic",function(req,res){
  let Search=_.lowerCase(req.params.topic);
  var found=false;
  Post.find({},function(err,results){
    if(!err){
      for(var i=0;i<results.length;i++){
        if(_.lowerCase(results[i].title)==Search){
          res.render("post",{
            TITLEPOST:results[i].title,
            CONTENTPOST:results[i].content
          });
          found=true;
          break;
        }
      }
    }
    else if(!found){
      console.log("Page Not Found");
      res.render("post",{
        TITLEPOST:results.title,
        CONTENTPOST:results.content
      });
    }
    else{
      console.log(err);
    }
    found=false;
  });
  
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
