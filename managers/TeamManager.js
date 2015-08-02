
// Define the manager
var manager = miitoo.resolve(
    ['Slugify', 'MiitConfig', 'TeamStore', 'TeamModel', 'ChatroomStore'],
    function(slugify, config, TeamStore, Team, ChatroomStore) {

    function onCreate(team, user, cb) {

        // Add the user in the team
        TeamStore.addUser(team, user, ['USER', 'ADMIN', 'OWNER'], function(err) {
            if(!err) {

                // Create a room in the team
                ChatroomStore.create(team, 'Général');
            }

            return cb(err, team);
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

                // If there is no problem, then create things for the team
                onCreate(team, user, cb);
            });
        }
    };
});

// Register the manager
miitoo.register('TeamManager', manager);
