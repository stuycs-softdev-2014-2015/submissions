console.log("HELLO");

var Place = Backbone.Model.extend({
    onchange : function() {
	console.log("Changed");
    },
    showchange: function(){
	console.log("Changing: "+this.toString());
    },
    initialize:function(){
	this.on("change",this.onchange);
    },
    destroy: function() {
	this.off("change",showchange);
    },
    defaults: {
	name :"Place name",
	rating:0,
    },
    validate : function(attrs,options) {
	if (isNaN(attrs.rating)){
	    return "need number";
	}
    }
});

var EditView = Backbone.View.extend({
    el : "#edit",
    template :  _.template($("#edit_template").html()),
    events : {
	"click #up" : function(e) {
	    var r = this.model.get("rating");
	    r = parseInt(r);
	    r = r + 1;
	    this.model.set("rating",r);
	    this.render();
	},
     
	"click #down" : function(e) {
	    var r = this.model.get("rating");
	    r = parseInt(r);
	    r = r - 1;
	    this.model.set("rating",r);
	    this.render();
	},
     
	"click #del" : function(e) {
	    this.remove();
	}
    },
    initialize:function(){
	this.render();
    },
    render: function() {
	var e = this.template(this.model.toJSON());
	this.$el.empty();
	this.$el.append(e);
	return this;
    }
    
});


var PlaceView = Backbone.View.extend({
    el : "#place",
    template :  _.template($("#place_template").html()),
    initialize:function(){
	this.render();
    },
    render: function() {
	var e = this.template(this.model.toJSON());
	this.$el.empty();
	this.$el.append(e);
	return this;
    }
});


var p1 = new Place({name:"Terry's",rating:5});
var v1 = new PlaceView({model:p1});
var e1 = new EditView({model:p1});