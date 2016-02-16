var User = Backbone.Model.extend();
_.extend(User, Backbone.Events);

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
    console.log(id);
  },

  template: _.template($("#usersTemplate").html()),

  render: function() {
    $(this.el).html(this.template({ users: this.collection.toJSON() }));
  }
});

var users = new UsersView({
  el: $("#users-list")
});
