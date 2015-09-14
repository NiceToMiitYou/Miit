'use strict';

// Define the store
var store = miitoo.resolve(['TeamModel', 'Mongoose'], function(Team, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    // Map users from team
    function mapUsers(team) {
        var users = ((team || {}).users || []);

        return users.filter(function(userTeam) {
                return userTeam.user !== null;
            })
            .map(function(userTeam) {
                var user =  (userTeam || {}).user || {};

                var obj = {
                    id:     user.id,
                    name:   user.name,
                    avatar: user.avatar,
                    roles:  userTeam.roles
                };

                if(user.email) {
                    obj.email = user.email;
                }

                return obj;
            });
    }

    // Shortcut for update
    function updateTeam(conditions, update, cb) {
        Team.update(conditions, update, function(err, doc) {
            // Log the error
            if(err) {
                miitoo.logger.error(err.message);
                miitoo.logger.error(err.stack);
            }

            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    }

    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        create: function(name, slug, applications, cb) {

            // Create the team
            var team = new Team({
                name:         name,
                slug:         slug,
                applications: applications
            });
            
            // Save the team
            team.save(function(err) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, team);
                }
            });
        },

        findTeam: function(team, cb) {
            var teamId = getId(team);

            if(!ObjectId.isValid(teamId)) {
                return;
            }

            Team
                .findOne({
                    _id: teamId
                }, {
                    users: 0 // Exclude users from the list
                })
                .exec(function(err, team) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, team);
                    }
                });
        },

        findTeamBySlug: function(slug, cb) {
            Team
                .findOne({
                    slug: slug
                }, {
                    users: 0 // Exclude users from the list
                })
                .exec(function(err, team) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, team);
                    }
                });
        },

        update: function(team, name, publix, cb) {
            var teamId = getId(team);

            var conditions = {
                _id: teamId
            };

            var update = {
                name:   name,
                public: publix
            };

            updateTeam(conditions, update, cb);
        },

        addUser: function(team, user, roles, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var conditions = {
                _id:          teamId,
                'users.user': { $ne: userId }
            };

            var update = {
                $addToSet: {
                    users: {
                        user:  userId,
                        roles: roles
                    }
                }
            };

            updateTeam(conditions, update, cb);
        },

        removeUser: function(team, user, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var conditions = {
                _id: teamId
            };

            var update = {
                $pull: {
                    users: {
                        user: userId
                    }
                }
            };

            updateTeam(conditions, update, cb);
        },

        promoteUser: function(team, user, roles, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var conditions = {
                _id:          teamId,
                'users.user': userId
            };

            var update = {
                $pushAll: {
                    'users.$.roles': roles
                }
            };
            
            updateTeam(conditions, update, cb);
        },

        demoteUser: function(team, user, roles, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var conditions = {
                _id:           teamId,
                'users.user':  userId
            };

            var update = {
                $pullAll: {
                    'users.$.roles': roles
                }
            };
            
            updateTeam(conditions, update, cb);
        },

        addApplication: function(team, identifier, publix, cb) {
            var teamId = getId(team);

            var conditions = {
                _id: teamId
            };

            var update = {
                $push: {
                    'applications': {
                        identifier: identifier,
                        publix:     publix
                    }
                }
            };
            
            updateTeam(conditions, update, cb);
        },

        updateApplication: function(team, identifier, publix, cb) {
            var teamId = getId(team);

            var conditions = {
                _id:                       teamId,
                'applications.identifier': identifier
            };

            var update = {
                $set: {
                    'applications.$.public': publix
                }
            };
            
            updateTeam(conditions, update, cb);
        },

        removeApplication: function(team, identifier, cb) {
            var teamId = getId(team);

            var conditions = {
                _id: teamId
            };

            var update = {
                $pull: {
                    'applications': {
                        identifier: identifier
                    }
                }
            };
            
            updateTeam(conditions, update, cb);
        },

        findUser: function(team, user, cb) {
            var teamId = getId(team);
            var userId = getId(user);

            Team
                .findOne({
                    _id: teamId
                })
                .populate({
                    path:    'users.user',
                    match:   { _id: userId },
                    select:  'name email avatar',
                    options: { limit: 1 }
                })
                .exec(function(err, team) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        var users = mapUsers(team);

                        cb(err, users[0]);
                    }
                });
        },

        findUsers: function(team, cb) {
            var teamId = getId(team);

            Team
                .findOne({
                    _id: teamId
                })
                .populate({
                    path:   'users.user',
                    select: 'name email avatar'
                })
                .exec(function(err, team) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        var users = mapUsers(team);

                        cb(err, users);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('TeamStore', store);
