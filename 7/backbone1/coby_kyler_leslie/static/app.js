
var Place = Backbone.Model.extend({
    initialize : function(){
	this.on({"change":function() {
	    placeView.render();
	    console.log("change");
	}});
    },
    destroy:function(){
	this.off("change",this.onChange);
    },
    defaults: {
	'name' : "Name goes here",
	'rating' : '5',
	'review': "text"},
    validate : function(attr,options){
	if (isNaN(attr.rating)){
	    return "Need a number";
	}
    }
});

var PlaceView = Backbone.View.extend({
		el : "#place",
		template :  _.template( $("#place_template").html() ),
	
		initialize : function() {
				this.render();
		},
		render:function() {
				var e = this.template(this.model.toJSON());
				this.$el.empty();
				this.$el.append(e);
				return this;
		}
});
var PlaceView2 = Backbone.View.extend({
		el : "#edit",
		template :  _.template( $("#edit_template").html() ),
		events : {
				"click #del" : function(e){
						this.remove();
				    v1.remove()
				},
				"click #up" : function(e){
						var r = this.model.get("rating");
						r = parseInt(r);
						r = r + 1;
						this.model.set("rating",r);
						this.render();
				    v1.render()
				},
				"click #down" : function(e){
						var r = this.model.get("rating");
						r = parseInt(r);
						r = r - 1;
						this.model.set("rating",r);
						this.render();
				    v1.render()
				}
				
		},
		initialize : function() {
				this.render();
		},
		render:function() {
				var e = this.template(this.model.toJSON());
				this.$el.empty();
				this.$el.append(e);
				return this;
		}
});


var p1 = new Place({name:"Terry's",rating:5});
var v1 = new PlaceView2({model:p1, view:v2});
var v2 = new PlaceView({model:p1});
v1.render();
 _.template( $("#edit_template").html() );
