window.App = {};
window.App.events = _.extend({}, Backbone.Events);

var User = Backbone.Model.extend();

var Users = Backbone.Collection.extend({
  model: User,
  url: "https://api.pipedrive.com/v1/users?api_token=678ff83eb61acc57410ea663bbcbf25b651d787c",
  parse: function(response) {
    console.log(response);
    return response.data;
  }
});

var UsersView = Backbone.View.extend({
  model: User,
  initialize: function() {
    this.collection = new Users;

    var that = this;
    this.collection.fetch({
      success: function() {
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
    var userModel = _.find(models, function(m) {
      return m.id == id;
    });
    App.events.trigger("user-selected", userModel.attributes);
  },

  template: _.template($("#usersTemplate").html()),

  render: function() {
    $(this.el).html(this.template({ users: this.collection.toJSON() }));
  }
});

var ProfileView = Backbone.View.extend({
  model: User,

  initialize: function() {
    App.events.on("user-selected", function(user) {
      console.log(user);
      this.render(user);
    }, this);
  },

  render: function(user) {
    $(this.el).html(this.template({ user: user }));
  }
});

var users = new UsersView({
  el: $("#users-list")
});

var profile = new ProfileView({
  el: $("#profile-view")
});
