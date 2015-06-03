var bcrypt = require('bcrypt-nodejs')
  , config = require('../../config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , Users
  , UsersLogin
  , UsersBanned
  , Files
  , UsersFilesSaves
  , UsersFilesVotes
  , Tags
  , FilesTags
;

Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'users_id',
  generateHash: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'));
  },
  login: function () {
    return this.hasOne(UsersLogin, 'users_id');
  },
  banned: function () {
    return this.hasOne(UsersBanned, 'users_id');
  },
  files: function () {
    return this.hasMany(Files, 'users_id');
  },
  filesVotes: function () {
    return this.hasMany(UsersFilesVotes, 'users_id');
  },
  filesSaves: function () {
    return this.hasMany(UsersFilesSaves, 'users_id');
  }
});

UsersLogin = bookshelf.Model.extend({
  tableName: 'users_login',
  idAttribute: 'users_login_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

UsersBanned = bookshelf.Model.extend({
  tableName: 'users_banned',
  idAttribute: 'users_banned_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  bannedBy: function () {
    return this.belongsTo(Users, 'banned_by_users_id');
  }
});

Files = bookshelf.Model.extend({
  tableName: 'files',
  idAttribute: 'files_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  tags: function () {
    return this.hasMany(FilesTags, 'files_id');
  }
});

UsersFilesSaves = bookshelf.Model.extend({
  tableName: 'users_files_saves',
  idAttribute: 'users_files_saves_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  file: function () {
    return this.belongsTo(Files, 'files_id');
  }
});

UsersFilesVotes = bookshelf.Model.extend({
  tableName: 'users_files_votes',
  idAttribute: 'users_files_votes_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  file: function () {
    return this.belongsTo(Files, 'files_id');
  }
});

Tags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id',
});

FilesTags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id',
  file: function () {
    return this.hasOne(File, 'files_id');
  },
  tag: function () {
    return this.hasOne(Tags, 'tags_id');
  }
});

module.exports = {
  "Users": Users,
  "UsersLogin": UsersLogin,
  "UsersBanned": UsersBanned,
  "Files": Files,
  "UsersFilesSaves": UsersFilesSaves,
  "UsersFilesVotes": UsersFilesVotes,
  "Tags": Tags,
  "FilesTags": FilesTags
};