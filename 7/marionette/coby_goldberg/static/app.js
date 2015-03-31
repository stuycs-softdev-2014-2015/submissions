console.log("HELLO");

var App = new Marionette.Application();

var Teacher = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        name: '',
        period: 0,
        comments: ''
    }
});

var TeacherList = Backbone.Collection.extend({
    model: Teacher,
    url: 'update', // was sync in chesley code
    comparator: function(item) {
        // Sort by descending urgency
        return -item.get('period');
    },
    initialize: function() {
        // Fetch data from server; sends a GET request to server
        this.fetch();
        // Re-sort collection when a child's urgency changes
        this.on("change:period", this.sort, this);
        var other_this = this; // gotta love the js this
        // Fetch up-to-date data from server every 10 seconds
        setInterval(function() {
            other_this.fetch();
        }, 100000);
    }
});

App.addRegions({
    place: "#place"
});

App.on("start", function(){
    console.log("start");

    var teachers = new TeacherList();
    var createView = new App.CreateView({collection: teachers});
    App.place.show(createView);
});

App.StaticView = Marionette.ItemView.extend({
    template: "#static-template",
    tagName : "tr",
    events : {
	
	"blur #comments": function(e) {
	    this.model.set('comments', e.target.innerHTML);
	}
	
    },

    modelEvents: {
        // Re-render when the model is changed
        "change": function() {
            this.render();
            // Synchronize changes with server; Sends a PUT request to server
            this.model.save();
        }
    }
});

App.CreateView = Marionette.CompositeView.extend({
    template: "#new-template",
    childView: App.StaticView,
    childViewContainer: 'tbody',
    events : {
	"click #add" : function(){
	    var n = $("#teacher-name").val();
	    var com = $("#comments").val();
	    var per = $("#period").val();
	    if (name.length > 0 && com.length > 0 && period.length > 0){
		var newTeacher = this.collection.create({name: n, comments: com, period: per}, { wait: true});
	    }
	}
    }
});

App.start();
