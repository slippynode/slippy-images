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

      function makeSubmission (users) {
        var submissionsData = {
          "users_id": users.id,
          "title": req.body.title,
          "anonymous": req.body.anonymous,
          "private": req.body.private,
        };

        new db.Submissions(submissionsData).save()
          .then(function (submissions) {
            console.log(submissions);
            var submissionsFileData = {
              "submissions_id": submissions.id,
              "users_id": submissions.users_id,
              "size": req.file.size,
              "directory": req.file.directory,
              "original_name": req.file.originalname,
              "caption": req.body.caption,
              "upload_ip": req.ip
            };

            new db.SubmissionsFiles(submissionsFileData).save()
              .then(function (file) {
                return res.status(200).send(file);
              })
              .catch(function (error) {
                return res.status(404).send("Could not upload file!");
              })
            ;

          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

      if (req.body.anonymous) {
        new db.UsersAnonymous({ ip_address: req.ip }).save()
          .then(function (users) {
            makeSubmission(users);
          })
          .catch(function (error) {
            return res.status(404).send("Could not upload anonymous file!");
          })
        ;
      }
      else {
        new db.Users({ users_id: req.user.id }).fetch()
          .then(function (users) {
            makeSubmission(users);
          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

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