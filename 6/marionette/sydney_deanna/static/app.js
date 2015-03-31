var App = new Backbone.Marionette.Application();

App.addRegions({
    blog: "#blog",
});

App.on("start",function(){
    console.log("onStart");

    var bloggy = new App.CompView();
    App.blog.show(bloggy);

    Backbone.history.start();
});

App.CompView = Marionette.CompositeView.extend({
    template: "#newPost",
    childView : App.BlogView,
    childViewContainer: "tbody",
    modelEvents : {
	"change" : function() { this.render(); }
    } ,
    events : {
        "click #add" : function() {
            var n = $("#nPost").val();
            if (n.length > 0){
                this.collection.add(new Blog({blog:n}));
                this.collection.sort();
                $("#nPost").val("");
                
                }
            }
        }
});
					       
App.BlogView = Marionette.ItemView.extend({
    template : "#blcdogPost",
});

//App.PostView = Marionette.ItemView.extend({
  //  template : "#onPost"
//});

// we need some sort of composite view, idk how that works 

var Blog = Backbone.Model.extend();
var Blogs = Backbone.Collection.extend({
    model:Blog

});

//var start = new Blog({name:"Name"});
var b = new Blog({blog:"heres my blog"});
var c = new Blog([b]);

App.start();
