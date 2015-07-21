
// Define the store
var store = miitoo.resolve(['TeamModel'], function(Team) {

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
                miitoo.logger.error(err);
            }

            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    }

    function getId(object) {
        return object._id || object.id || object;
    }

    return {
        findTeam: function(team, cb) {
            var teamId = getId(team);

            Team
                .findOne({
                    _id: teamId
                }, {
                    users: 0 // Exclude users from the list
                })
                .exec(function(err, team) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err);
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
                        miitoo.logger.error(err);
                    }

                    if(typeof cb === 'function') {
                        cb(err, team);
                    }
                });
        },

        addUser: function(team, user, roles, cb) {
            var teamId = getId(team);
            var userId = getId(user);

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
            var teamId = getId(team);
            var userId = getId(user);

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

        addRoleUser: function(team, user, roles, cb) {
            var teamId = getId(team);
            var userId = getId(user);

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

        removeRoleUser: function(team, user, roles, cb) {
            var teamId = getId(team);
            var userId = getId(user);

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
                        miitoo.logger.error(err);
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
                        miitoo.logger.error(err);
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
