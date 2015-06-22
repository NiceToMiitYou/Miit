
// Define the store
var store = miitoo.resolve(['UserModel', 'TeamModel'], function(User, Team) {

    function mapUsers(team) {
        return ((team || {}).users || []).map(function(userTeam) {
            var user =  (userTeam || {}).user || {};

            user.roles = userTeam.roles;

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

    function findOneAndUpdate(conditions, update, cb) {
        Team.findOneAndUpdate(conditions, update, function(err, doc) {
            // Log the error
            if(err) {
                miitoo.logger.error(err);
            }

            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    }


    return {
        findTeam: function(team, cb) {
            Team
                .findOne({
                    _id: team._id || team
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
            if(!team || !user) {
                return;
            }

            var conditions = {
                _id: team._id || team,
                'users.user': { $ne: user._id || user }
            };

            var update = {
                $addToSet: {
                    users: {
                        user:  user._id || user,
                        roles: roles
                    }
                }
            };

            findOneAndUpdate(conditions, update, cb);
        },

        addRoleUser: function(team, user, roles, cb) {
            if(!team || !user) {
                return;
            }

            var conditions = {
                _id: team._id || team,
                'users.user': { $ne: user._id || user }
            };

            var update = {
                $addToSet: {
                    users: {
                        user:  user._id || user,
                        roles: roles
                    }
                }
            };
            
            findOneAndUpdate(conditions, update, cb);
        },

        removeUser: function(team, user, cb) {
            if(!team || !user) {
                return;
            }

            var conditions = {
                _id: team._id || team
            };

            var update = {
                $pull: {
                    users: {
                        user: user._id || user
                    }
                }
            };

            findOneAndUpdate(conditions, update, cb);
        },

        findUser: function(team, user, cb) {
            Team
                .findOne({
                    _id: team._id || team
                })
                .populate({
                    path:    'users.user',
                    match:   { _id: user._id || user },
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
            Team
                .findOne({
                    _id: team._id || team
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
