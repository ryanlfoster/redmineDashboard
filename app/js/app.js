// mincer directives processor are listed bellow
//= require namespaces
//= require config
//= require libs/logger
//= require libs/template
//= require_tree models
//= require_tree views
//

/**
 * Entry point of the application
 * Creates a new app binded with 'main' div, intialize (app.init) it, and
 * start it (app.boot)
 */

(function(global, models, views) {
  'use strict';

  var LOG = LOGGER('app');

  function App(el) {
    this.el = el;

    // Object containing all the singletons model
    // shared by all controls.
    this.data = {};
  }

  /**
   * Instantiate models in the `data` namespace.
   *
   * @method createModels
   * @chainable
   */
  App.prototype.createModels = function() {
    LOG('::createModels::');

    this.data.redmineModel  = new (models.RedmineModel)();
    this.data.teamModel  = new (models.TeamModel)();
    this.data.issuesModel  = new (models.IssuesModel)();
    this.data.usersModel  = new (models.UsersModel)();

    return this;
  };

  App.prototype.bindModels = function() {
    LOG('::bindModels::');
    return $.when(
      this.data.usersModel.bind('change', _.bind(this.data.teamModel.update, this)),
      this.data.issuesModel.bind('change', _.bind(this.data.redmineModel.update, this)),
      this.data.issuesModel.bind('change', _.bind(this.data.teamModel.update, this))
      )
    .done(function() {
        LOG('Binding models is done');
    })
    .fail(function() {
        console.error('Error while binding models');
    });
  };

  /**
   * Bind global listeners of different models to handle
   * global and asynchronous events from the stream.
   *
   * @method bindListeners
   */
  App.prototype.bindListeners = function() {
    LOG('::bindListeners::');
  };

  /**
   * Initalize the application by registering all navigable
   * controls for the application.
   *
   * @interface
   * @chainable
   */
  App.prototype.createViews = function() {
    // Controls
    LOG('::createViews::');

    this.data.redmineView  = new (views.RedmineView)();
    this.data.teamView  = new (views.TeamView)();

    return this;
  };

  /**
   * Fetch all data required by the application
   */
  App.prototype.fetch = function() {
    LOG('::fetch::');

    return $.when(
      // static models
      this.data.usersModel.fetch(),
      this.data.issuesModel.fetch()/*,
      this.data.redmineModel.fetch(),
      this.data.teamModel.fetch()*/
    )
    .done(function() {
        LOG('Fetching data is done');
    })
    .fail(function() {
        console.error('Error while fetching application data');
    });
  };

  /**
   * Init process of the main application
   * First start the event source stream and start the
   * install application and fetch all models.
   * When these three process are done, free the installation
   * and start on the first screen of the main application.
   *
   * @async
   * @chainable
   */
  App.prototype.init = function() {
    LOG('::boot::');

    this.createModels();
    this.createViews();

    function success() {
      LOG('::success::');
    }

    function failure() {
      console.error('Error while booting the application');
    }

    //  Bind models
    $.when(
      this.bindModels(),
      this.fetch()
    )
    .then(success, failure, this);

    return this;
  };

  global.App = App;

})(this, this.Models, this.Views);