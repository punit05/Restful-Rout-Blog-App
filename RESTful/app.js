var express=require("express");
var app=express();
var methodOverride=require("method-override");
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
var expressSanitizer=require("express-sanitizer");
//app config
 mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));//so that we can surf our custom directory when we get.
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Mongoose config
var blogSchema=new mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}
            
        
    });
var Blog=mongoose.model("Blog",blogSchema);
    

//REstful Routes config

app.get("/",function(req,res)
{
    res.redirect("/blogs");
});
//INDEX Roue
app.get("/blogs",function(req,res)
{
    Blog.find({},function(err,blogs)
    {
    if(err)
    {
        console.log("Error!");
    }
    else 
    {
        res.render("index",{blogs: blogs});
    }
    });
   
});
//NEW ROUTE
app.get("/blogs/new",function(req,res)
{
    res.render("new");
});
//create route
app.post("/blogs",function(req,res)
{
    console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body)  //req.body is the data from the form blog.body is the body of the form because we have tp santize that
     console.log("+++++++++++");
     console.log(req.body);
    //create blog
    Blog.create(req.body.blog,function(err,newBlog)
    {
        if(err)
        {
            res.render("new");
        }
        else 
        {
            //redirect
            res.redirect("/blogs");
        }
    });
    
    
});
//show route create
app.get("/blogs/:id",function(req,res)
{
    
    
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs");
        }
        else 
        {
            res.render("show",{blog: foundBlog});
        }
    });
    
}
);
//edit


app.get("/blogs/:id/edit",function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            res.redirect("blogs");
        }
        else 
        {
            res.render("edit",{
                blog:foundBlog
            });
        }
    });
    
});
//update route this is put request
app.put("/blogs/:id",function(req,res)
{
    req.body.blog.body=req.sanitize(req.body.blog.body) 
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else 
        {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//delete route
app.delete("/blogs/:id",function(req,res)
{
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else 
        {
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("server is ruuning");
})