(function(global, models) {
  'use strict';

  var
    /*
     * Logger for my model
     */
     LOG = LOGGER('UsersModel');

   var UsersModel = Backbone.Model.extend({

    url: "http://localhost:8888/res/users.json",

    initialize: function(){
      LOG('::initialize::');
      //this.myFetch();
      this.on('change', function(){
        LOG('- Values for model UsersModel have changed.');
      });
      var self = this;
      setInterval(function() {
          self.myFetch();
      }, 10000);
    },

    myFetch: function() {
     LOG('::myFetch::');
     this.fetch();
    }
  });

   models.UsersModel = UsersModel;

 })(this, this.Models);
