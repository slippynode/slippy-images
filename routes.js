var _ = require('lodash')
  , path = require('path')
  , config = require('./config.json')
  , gm = require('gm')
;

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
      new db.Submissions().fetchAll()
        .then(function (submissions) {
          return res.status(200).send(submissions.toJSON());
        })
        .catch(function (error) {
          return res.status(404).send("Could not get submissions!");
        })
      ;
    },

    getSubmission: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {
          return res.status(200).send(submission);
        })
        .catch(function (error) {
          return res.status(404).send("Could not get submission!");
        })
      ;
    },

    createSubmission: function (req, res, next) {
      function makeSubmission (usersId) {
        var submissionsData = {
          "title": req.body.title,
          "anonymous": req.body.anonymous,
          "private": req.body.private,
        };

        if (usersId) submissionsData.users_id = usersId;

        new db.Submissions(submissionsData).save()
          .then(function (submissions) {

            function recursiveFileUpload (file) {
              var submissionsFileData = {
                "submissions_id": submissions.id,
                "size": file.size,
                "directory": file.path,
                "original_name": file.originalname,
                "name": file.name,
                "caption": req.body.caption,
                "upload_ip": req.ip
              };

              if (usersId) submissionsFileData.users_id = usersId;

              new db.SubmissionsFiles(submissionsFileData).save()
                .then(function (file) {

                  var isImage
                    , thumbnailsPath
                    , thumbnailsData
                    , fileToResize
                    , gravity
                  ;

                  file = file.toJSON();
                  file.submission = submissions.get('name');

                  function recurseOrReturn (file) {
                    if (req.files.file.length > 0) {
                      var nextFile = req.files.file.shift();
                      if (nextFile) {
                        recursiveFileUpload(nextFile);
                      }
                      else {
                        return res.status(200).send(file);
                      }
                    }
                    else {
                      return res.status(200).send(file);
                    }
                  };

                  isImage = config.thumbnail_extensions
                    .indexOf(path.extname(file.name))
                  ;

                  if (isImage > -1) {

                    if (path.extname(file.name) === '.gif') {
                      fileToResize = file.directory + '[0]';
                      thumbnailsPath = path.join(config.thumbnails, file.name);
                      thumbnailsPath = thumbnailsPath
                        .replace(path.extname(thumbnailsPath), '.png');
                    }
                    else {
                      fileToResize = file.directory;
                      thumbnailsPath = path.join(config.thumbnails, file.name);
                    }

                    thumbnailsData = {
                      "submissions_id": submissions.id,
                      "submissions_files_id": file.submissions_files_id,
                      "directory": thumbnailsPath,
                      "name": file.name
                    };

                    gm(fileToResize)
                      .resize('300', '300', '^')
                      .gravity('Center')
                      .crop('300', '300')
                      .write(thumbnailsPath, function (err) {
                        if (err) console.log(err);
                        new db.SubmissionsThumbnails(thumbnailsData).save()
                          .then(function (thumbnail) {
                            recurseOrReturn(file);
                          })
                          .catch(function (error) {
                            return res.status(404)
                              .send("Could not upload file!");
                          })
                      })
                    ;
                  }
                  else {
                    recurseOrReturn(file);
                  }

                })
                .catch(function (error) {
                  return res.status(404).send("Could not upload file!");
                })
              ;
            }

            if (req.files.file.length > 0) {
              recursiveFileUpload(req.files.file.shift());
            }
            else {
              recursiveFileUpload(req.files.file);
            }

          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

      if (req.body.anonymous === 'true') {
        makeSubmission();
      }
      else {
        new db.Users({ users_id: req.user.id }).fetch()
          .then(function (users) {
            makeSubmission(users.id);
          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

    },

    updateSubmission: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {

          if (!submission)
            return res.status(400).send("Could not update submission!");

          if (submission.get('users_id') === req.user.id) {
            submission.save(req.body, { method: 'update' })
              .then(function (update) {
                return res.status(200).send(update);
              })
              .catch(function (error) {
                return res.status(400).send("Could not update submission!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to update submission!");
          }

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteSubmission: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {
          if (submission.get('users_id') === req.user.id) {
            submission.destroy()
              .then(function (success) {
                return res.status(200).end();
              })
              .catch(function (error) {
                return res.status(404).send("Could not delete submission!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to delete submission!");
          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not delete submission!");
        })
      ;
    },

    // Submissions Files Routes ================================================

    getSubmissionsFile: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (submission.get('name') === req.params.submission) {
            return res.status(200).send(file);
          }
        })
        .catch(function (error) {
          return res.status(404).send("Could not get file!");
        })
      ;
    },

    createSubmissionsFile: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submissions) {
          if (submissions.get('users_id') === req.user.id) {

            var submissionsFileData = {
              "submissions_id": submissions.id,
              "users_id": submissions.get('users_id'),
              "size": req.files.file.size,
              "directory": req.files.file.path,
              "original_name": req.files.file.originalname,
              "name": req.files.file.name,
              "caption": req.body.caption,
              "upload_ip": req.ip
            };

            new db.SubmissionsFiles(submissionsFileData).save()
              .then(function (file) {
                file = file.toJSON();
                file.submission = submissions.get('name');
                return res.status(200).send(file);
              })
              .catch(function (error) {
                return res.status(404).send("Could not upload file!");
              })
            ;

          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not upload file!");
        })
      ;
    },

    updateSubmissionsFile: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (!file) {
            return res.status(400).send("File does not exist!");
          }
          else if (file.get('users_id') !== req.user.id) {
            return res.status(400).send("User not authorized");
          }
          else if (submission.get('name') !== req.params.submission) {
            return res.status(500).send("Internal server error!");
          }
          else {
            file.save(req.body, { method: 'update' })
              .then(function (update) {
                return res.status(200).send(update);
              })
              .catch(function (error) {
                return res.status(400).send("Could not update submission!");
              })
            ;
          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteSubmissionsFile: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (!file) {
            return res.status(400).send("File does not exist!");
          }
          else if (file.get('users_id') !== req.user.id) {
            return res.status(400).send("User not authorized");
          }
          else if (submission.get('name') !== req.params.submission) {
            return res.status(500).send("Internal server error!");
          }
          else {
            file.destroy()
              .then(function (success) {
                return res.status(200).end();
              })
              .catch(function (error) {
                return res.status(400).send("Could not delete file!");
              })
            ;
          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;

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