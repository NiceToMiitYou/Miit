'use strict';

// Define the manager
var manager = miitoo.resolve(
    ['Slugify', 'MiitConfig', 'TeamStore', 'ChatroomStore', 'InvitationManager'],
    function(slugify, config, TeamStore, ChatroomStore, InvitationManager) {

    return {
        create: function(email, name, cb) {
            var self = this;

            // Generate the name
            var slug = slugify(name);

            // Check the slug
            if(slug.length < 4 || 0 <= config.restrict.subdomains.indexOf(slug)) {
                return cb(new Error('Restricted name.'));
            }

            var applications = [
                {
                    identifier: 'APP_CHAT'
                },
                {
                    identifier: 'APP_QUIZ'
                },
                {
                    identifier: 'APP_DOCUMENTS'
                }
            ];

            TeamStore.create(name, slug, applications, function(err, team) {
                if(err)
                {
                    return cb(err);
                }

                var roles = ['USER', 'ADMIN', 'OWNER'];

                InvitationManager.invite(team, email, roles, function(err, invitation) {

                    // Create a room in the team
                    ChatroomStore.create(team, 'Général');

                    return cb(err, team);
                });
            });
        }
    };
});

// Register the manager
miitoo.register('TeamManager', manager);
