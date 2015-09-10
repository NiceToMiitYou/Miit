
// Define the manager
var manager = miitoo.resolve(
    ['Slugify', 'MiitConfig', 'UserStore', 'TeamStore', 'TeamModel', 'ChatroomStore', 'MailManager'],
    function(slugify, config, UserStore, TeamStore, Team, ChatroomStore, MailManager) {

    function onCreate(team, user, cb) {

        UserStore.addTeam(user, team, function(err) {
            if(err) {
                return cb(err, team);
            }

            // Add the user in the team
            TeamStore.addUser(team, user, ['USER', 'ADMIN', 'OWNER'], function(err) {
                if(!err) {

                    // Create a room in the team
                    ChatroomStore.create(team, 'Général');
                }

                return cb(err, team);
            });
        });
    }

    return {
        create: function(user, name, cb) {
            // Generate the name
            var slug  = slugify(name);

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

            // Create the team
            var team = new Team({
                name:         name,
                slug:         slug,
                applications: applications
            });
            
            // Save the team
            team.save(function(err) {
                if(err)
                {
                    return cb(err);
                }

                var url = 'https://' + slug + '.miit.fr/';
                
                MailManager.sendMail(user.email, 'mail.new_miit.object', './views/mail/new_miit.ejs', {
                    name: name,
                    url:  url
                }, function(error) {
                    
                    // If there is no problem, then create things for the team
                    onCreate(team, user, cb);
                });
            });
        },

        invite: function(team, user, roles, cb) {

            // Add the user to the team
            TeamStore.addUser(team, user, roles, function(err) {
                if(err) {
                    return cb(err);
                }

                var url = 'https://' + team.slug + '.miit.fr/';

                MailManager.sendMail(user.email, 'mail.invite.object', './views/mail/invite.ejs', {
                    name: team.name,
                    url:  url
                }, function(error) {
                    
                    if(typeof cb === 'function') {
                        cb(error);
                    }
                });
            });
        }
    };
});

// Register the manager
miitoo.register('TeamManager', manager);
