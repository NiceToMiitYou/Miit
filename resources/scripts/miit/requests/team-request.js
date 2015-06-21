(function(){
    var MiitTeam = injector.resolve(
        ['miit-utils'],
        function(MiitUtils) {
            return {
                users: function(cb) {
                    // List all users
                    MiitUtils.ajax.send('/app/team/users', cb);
                },

                invite: function(email, cb) {
                    // Register the user
                    MiitUtils.ajax.send('/app/team/invite', {
                        'email':  email
                    }, cb);
                },

                update: function(name, publix, cb) { // Use "publiX" for reserved word "public"
                    var data =  {
                        'name':   name
                    };

                    if(publix) {
                        data.public = 'public';
                    }

                    // Update the user
                    MiitUtils.ajax.send('/app/team/update', data, cb);
                },

                promote: function(user_id, user_roles, cb) {
                    // Promote the user
                    MiitUtils.ajax.send('/app/team/promote', {
                        'id':     user_id,
                        'roles':  user_roles
                    }, cb);
                },

                demote: function(user_id, user_roles, cb) {
                    // Demote the user
                    MiitUtils.ajax.send('/app/team/demote', {
                        'id':     user_id,
                        'roles':  user_roles
                    }, cb);
                },

                remove: function(user_id, cb) {
                    // Demote the user
                    MiitUtils.ajax.send('/app/team/remove', {
                        'id':  user_id
                    }, cb);
                }
            };
        }
    );

    injector.register('miit-team-request', MiitTeam);
})();