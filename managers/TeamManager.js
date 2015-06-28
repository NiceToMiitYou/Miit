
// Define the manager
var manager = miitoo.resolve(
    ['Slugify', 'MiitConfig', 'TeamStore', 'TeamModel'],
    function(slugify, config, TeamStore, Team) {

    return {
        createTeam: function(user, name, cb) {
            // Generate the name
            var slug  = slugify(name);

            // Check the slug
            if(slug.length < 4 || 0 <= config.restrict.subdomains.indexOf(slug)) {
                return cb(new Error('Restricted name.'));
            }

            // Create the team
            var team = new Team({
                name: name,
                slug: slug,
                applications: ['APP_CHAT']
            });
            
            // Save the team
            team.save(function(errTeam) {
                if(errTeam)
                {
                    return cb(errTeam);
                }

                // Add the user in the team
                TeamStore.addUser(team, user, ['USER', 'ADMIN', 'OWNER'], function(errAdded) {
                    return cb(errAdded, team);
                });
            });
        },

        updateTeam: function(team, name, publix, cb) {

            // Check values
            if(!name || (true != publix && false != publix)) 
            {
                return cb(new Error('Invalid data.'));
            }

            // Find the team before update
            TeamStore.findTeam(team, function(err, teamToUpdate){
                if(err)
                {
                    return cb(err);
                }
                if(!team)
                {
                    return cb(new Error('No team to update'));
                }

                teamToUpdate.name   = name;
                teamToUpdate.public = publix;

                teamToUpdate.save(function(errUpdate) {
                    if(errUpdate) {
                        return cb(errUpdate);
                    }

                    return cb(null, teamToUpdate);
                });
            });
        }
    };
});

// Register the manager
miitoo.register('TeamManager', manager);
