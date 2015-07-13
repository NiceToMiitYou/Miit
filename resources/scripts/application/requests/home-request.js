var HomeRequest = {
    newsletter: function(email, cb) {

        // Register the user
        MiitUtils.ajax.send('/newsletter', {
            'email':  email
        }, cb);
    },

    registration: function(email, team, cb) {

        // Register the user
        MiitUtils.ajax.send('/register', {
            'email': email,
            'name':  team
        }, cb);
    }
};

module.exports = HomeRequest;