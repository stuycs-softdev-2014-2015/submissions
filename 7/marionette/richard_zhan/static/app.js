console.log("HELLO");
var App = new Marionette.Application();
App.addRegions({
    firstRegion: "#first-region",
    secondRegion:"#second-region"
});

App.on("start",function(){
    console.log("STARTING");
    var staticView = new App.StaticView();
    App.firstRegion.show(staticView);

    var compView = new App.CompView({collection:c});    
    App.secondRegion.show(compView);

    Backbone.history.start();

});

App.StaticView = Marionette.ItemView.extend({
    template : "#static-template"
});

App.GameView = Marionette.ItemView.extend({
    template : "#game-template",
    tagName : "tr",
	
    events : {
	"click #delete" : function() {
	    this.remove();
	}
    },
    modelEvents: {
	"change":function(){
	    this.render();
	}
    }
});

App.CompView = Marionette.CompositeView.extend({
    template : "#composite-template",
    childView : App.GameView,
    childViewContainer : "tbody",
    modelEvents: {
 	"change":function(){
 	    this.render();
 	}},
    events : {
	"click #add" : function(){
	    var n = $("#newname").val();
	    if (n.length > 0){
		this.collection.add(new Game({name:n}));
		$("#newname").val("");
		this.collection.sort();
	    }
	}
    }
});

var Game = Backbone.Model.extend();
var Games = Backbone.Collection.extend();
var c = new Games([]);
c.comparator = "name";



App.start();
