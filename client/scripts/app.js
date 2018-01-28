var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    if ( this.get('like') ) {
      this.set('like', false);
    } else {
      this.set('like', true);
    }
  }
});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    this.on('change', this.sort, this);
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  trueOrFalse: true,

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);

    this.trueOrFalse ? this.trueOrFalse = false : this.trueOrFalse = true;
    if ( !this.trueOrFalse ) {
      this.collection.models = this.collection.models.reverse();
    }
    this.render();
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change',function() {
      this.render();
    }, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
    // debugger
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
