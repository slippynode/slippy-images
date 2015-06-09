module.exports = function (db) {

  return {

    // User Routes =============================================================

    getUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(404).send("User does not exist!");
          else return res.status(200).send(data);
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    getUserPreferences: function (req, res, next) {
      new db.UsersPreferences({ users_id: req.user.id }).fetch()
        .then(function (data) {
          if (!data) return res.status(404).send("User does not exist!");
          else return res.status(200).send(data);
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    getUserSubmissions: function (req, res, next) {

    },

    getUserComments: function (req, res, next) {

    },

    getUserLikes: function (req, res, next) {

    },

    getUserDislikes: function (req, res, next) {

    },

    getUserSaves: function (req, res, next) {

    },

    updateUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(400).send("Could not update user!");

          if (req.body.password) {
            req.body.password = this.generateHash(req.body.password);
          }

          data.save(req.body, { method: 'update' })
            .then(function (update) {
              return res.status(200).send(update);
            })
            .catch(function (error) {
              return res.status(400).send("Could not update user!");
            })
          ;

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    updateUserPreferences: function (req, res, next) {
      new db.UsersPreferences({ users_id: req.user.id }).fetch()
        .then(function (data) {
          if (!data) {
            return res.status(400).send("Could not update preferences!");
          }

          data.save(req.body, { method: 'update' })
            .then(function (update) {
              return res.status(200).send(update);
            })
            .catch(function (error) {
              return res.status(400).send("Could not update preferences!");
            })
          ;

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          data.destroy()
            .then(function (success) {
              return res.status(200).end();
            })
            .catch(function (error) {
              return res.status(404).send("Could not delete user!");
            })
          ;
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    // Submissions Routes ======================================================

    getSubmissions: function (req, res, next) {

    },

    getSubmission: function (req, res, next) {

    },

    createSubmission: function (req, res, next) {
      console.log(req.body);
      console.log(req.files);
      res.status(200).end();
    },

    updateSubmission: function (req, res, next) {

    },

    deleteSubmission: function (req, res, next) {

    },

    // Tags Routes =============================================================

    getTags: function (req, res, next) {

    },

    createTags: function (req, res, next) {

    },

    deleteTags: function (req, res, next) {

    },

  };

};