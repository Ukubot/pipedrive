var Deal = Backbone.Model.extend();

var Deals = Backbone.Collection.extend({
  model: Deal,
  url: "https://api.pipedrive.com/v1/deals?start=0&api_token=678ff83eb61acc57410ea663bbcbf25b651d787c",
  parse: function(response) {
    return response.data;
  }
});

var Person = Backbone.Model.extend();

var Persons = Backbone.Collection.extend({
  model: Person,
  url: "https://api.pipedrive.com/v1/persons?start=0&api_token=678ff83eb61acc57410ea663bbcbf25b651d787c",
  parse: function(response) {
    return response.data;
  }
});

var App = {
  deals: new Deals(),
  persons: new Persons()
};

App.events = _.extend({}, Backbone.Events);

App.deals.fetch({
  success: function(deals) {
    App.events.trigger("deals-loaded", deals);
  }
});

App.persons.fetch({
  success: function(persons) {
    App.events.trigger("persons-loaded", persons);
  }
});


var Router = Backbone.Router.extend({
  routes: {
    "profile/:id": "getProfile",
    '': 'index'
  }
});

App.router = new Router();

App.router.on("route:getProfile", function(id) {
  App.selectedUserId = id;
});

Backbone.history.start();

var User = Backbone.Model.extend();

var Users = Backbone.Collection.extend({
  model: User,
  url: "https://api.pipedrive.com/v1/users?api_token=678ff83eb61acc57410ea663bbcbf25b651d787c",
  parse: function(response) {
    return response.data;
  }
});

var UsersView = Backbone.View.extend({
  model: User,
  initialize: function() {

    this.collection = new Users;
    var that = this;
    this.collection.fetch({
      success: function(collection) {
        var user = collection.get(App.selectedUserId);

        if (user) {
          App.events.trigger("user-selected", user);
        }
        that.render();
      }
    });
  },

  events: {
    "click div": "clicked"
  },

  clicked: function(e) {
    var id = $(e.currentTarget).data("id");
    var models = this.collection.models;
    var user = _.find(models, function(m) {
      return m.id == id;
    });
    App.selectedUserId = user.get("id");
    App.events.trigger("user-selected", user);
    App.router.navigate("profile/" + id);
  },

  template: _.template($("#usersTemplate").html()),

  render: function() {
    $(this.el).html(this.template({
      users: this.collection.toJSON(),
      selectedUserId: App.selectedUserId
    }));
  }
});


var ProfileView = Backbone.View.extend({
  model: User,

  initialize: function() {
    App.events.on("user-selected", function(user) {
      this.user = user;
      this.render();
    }, this);

    App.events.on("deals-loaded", function(deals) {
      this.render();
    }, this);

    App.events.on("persons-loaded", function(persons) {
      this.render();
    }, this);
  },

  template: _.template($("#profileTemplate").html()),

  render: function() {
    var user = this.user;
    if (!user) return;
    var persons = App.persons;
    var deals = App.deals;

var totalDealsCount = persons.reduce(function(s, person) { return s + person.get("open_deals_count"); }, 0);
    $(this.el).html(this.template({
      user: user.toJSON(),
      persons: persons.toJSON(),
      deals: deals.toJSON(),
      totalDealsCount: totalDealsCount
    }));
  }
});


var users = new UsersView({
  el: $("#users-list")
});

var profile = new ProfileView({
  el: $("#profile-view")
});

document.getElementById("currentDate").innerHTML = new Date().getDate();
