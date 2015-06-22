(function(){
    var MiitTeam = injector.resolve(
        ['miit-utils'],
        function(MiitUtils) {
            return {
                promote: function(user_id, user_roles, cb) {
                    // Promote the user
                    MiitUtils.ajax.send('/app/team/promote', {
                        'id':    user_id,
                        'roles': user_roles
                    }, cb);
                },

                demote: function(user_id, user_roles, cb) {
                    // Demote the user
                    MiitUtils.ajax.send('/app/team/demote', {
                        'id':    user_id,
                        'roles': user_roles
                    }, cb);
                }
            };
        }
    );

    injector.register('miit-team-request', MiitTeam);
})();