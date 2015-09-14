'use strict';

// Define the store
var store = miitoo.resolve(['InvitationModel', 'Mongoose'], function(Invitation, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        invite: function(team, email, roles, cb) {
            var teamId = getId(team);

            var conditions = {
                team:  teamId,
                email: email
            };

            var invitation = {
                team:  teamId,
                email: email,
                roles: roles,
                send:  false
            };

            Invitation
                .update(conditions, invitation, { upsert: true }, function(err) {
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

        getInvitationSent: function(team, invitation, cb) {
            var teamId       = getId(team),
                invitationId = getId(invitation);

            // Prevent crashes
            if(!ObjectId.isValid(invitationId)) {
                if(typeof cb === 'function') {
                    var err = new Error('Wrong type of id.');

                    cb(err);
                }

                return;
            }
            Invitation
                .findOne({
                    _id:  invitationId,
                    team: teamId,
                    send: true
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
        },

        getInvitationsNotSent: function(limit, cb) {
            Invitation
                .find({
                    send: false
                })
                .limit(limit)
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
