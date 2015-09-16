'use strict';

// Define the store
var store = miitoo.resolve(['InvitationModel', 'Mongoose'], function(Invitation, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        invite: function(team, email, roles, token, cb) {
            var teamId = getId(team);
                
            if(!ObjectId.isValid(teamId)) {
                if(typeof cb === 'function') {
                    cb();
                }

                return;
            }

            var conditions = {
                team:  teamId,
                email: email
            };

            var invitation = {
                team:  teamId,
                email: email,
                roles: roles,
                token: token
            };

            Invitation
                .update(conditions, invitation, { upsert: true }, function(err) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, invitation);
                    }
                });
        },

        remove: function(team, invitation, cb) {
            var teamId       = getId(team),
                invitationId = getId(invitation);

            // Prevent crashes
            if(!ObjectId.isValid(invitationId)) {
                return;
            }

            Invitation
                .remove({
                    _id:  invitationId,
                    team: teamId
                }, function(err) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
        },

        getInvitation: function(team, token, cb) {
            var teamId = getId(team);

            Invitation
                .findOne({
                    token: token,
                    team:  teamId
                })
                .exec(function(err, invitation) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, invitation);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('InvitationStore', store);
