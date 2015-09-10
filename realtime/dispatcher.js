// Get event
var EventEmitter = require('events').EventEmitter;

// Get the team store (initialized before the realtime)
var TeamStore = miitoo.injector.get('TeamStore');

// Getter for user
function getUser(spark) {
    return (spark.request || {}).user || false;
}

// Getter for team
function getTeam(spark) {
    return (spark.request || {}).team || false;
}

// Getter for user roles
function getRoles(spark) {
    return (spark.request || {}).roles || ['ANONYM'];
}

// Getter for team
function isRoleAllowed(team, user, role, userRoles) {
    if('PUBLIC' === role) {
        return true;
    }

    if(
        'USER' === role &&
        true   === team.public &&
        false  === !user.id
    ) {
        return -1 !== userRoles.indexOf('ANONYM') ||
               -1 !== userRoles.indexOf('USER')
    }   

    return -1 !== userRoles.indexOf(role);
}

// Getter for team
function isApplicationAllowed(team, application, userRoles) {
    if(!application) {
        return true;
    }

    // The list of applications
    var applications = team.applications || [];

    // Get the application
    var app;

    for(var index in applications) {
        if(applications[index].identifier === application) {
            app = applications[index];
        }
    }

    if(!app) {
        return false;
    }

    var isAnonym = -1 !== userRoles.indexOf('ANONYM');

    if (
        true === isAnonym && (
            false === app.public || false === team.public
        )        
    ) {
        return false;
    }
    
    return true;
}

// Define the Dispatcher
function Dispatcher() {

    // Roles needed to call this event
    var roles = {};

    // Application of the event
    var applications = {};

    // Define the emitter to this
    EventEmitter.call(this);

    // Extract the role of the event
    function getRoleForEvent(event) {
        return roles[event] || 'PUBLIC';
    }

    // Extract the application of the event
    function getApplicationForEvent(event) {
        return applications[event] || false;
    }

    // Check if allowed
    function isAllowed(event, team, user, userRoles) {
        // Retrieve informations
        var role        = getRoleForEvent(event);
        var application = getApplicationForEvent(event);

        var allowed = isApplicationAllowed(team, application, userRoles) &&
                      isRoleAllowed(team, user, role, userRoles);

        if(false === allowed) {
            miitoo.logger.debug('The user has been blocked. Needed role:', role, ' - Application:', application,' - Action:', event);
        }

        return allowed;
    }

    // Register 
    this.register = function(event, role, application, callback)
    {
        // If no application define
        if(typeof callback === 'undefined') {
            callback = application;
        }
        else
        {
            applications[event] = application;
        }

        // If no roles define
        if(typeof callback === 'undefined') {
            callback = role;
            role     = 'PUBLIC';
        }

        // Register roles
        roles[event] = role;

        // Bind event
        this.on(event, callback);
    };

    // Register 
    this.standalone = function(event, callback)
    {
        if(!event || !callback) {
            return;
        }

        // Bind event
        this.on('standalone:' + event, callback);
    };

    // Dispacth an event for standalone mode
    this.play = function(event, teamId, data)
    {
        if(!teamId) {
            return;
        }

        TeamStore.findTeam(teamId, function(err, team) {
            // Check if the team exist
            if(err || !team) {
                return;
            }

            this.emit('standalone:' + event, data, team);
        }.bind(this));
    };

    // Dispacth an event
    this.dispatch = function(spark, event, data, replayed)
    {
        var teamId = getTeam(spark);

        if(!teamId) {
            miitoo.logger.error('No team found for:', event);
            return;
        }

        TeamStore.findTeam(teamId, function(err, team) {
            if(err) {
                miitoo.logger.error(err.message);
                miitoo.logger.error(err.stack);
            }

            // Check if the team exist
            if(!team) {
                miitoo.logger.error('No team found for:', event);
                return;
            }

            var user  = getUser(spark),
                roles = getRoles(spark);

            // Check if he has the rigth access
            if(false === isAllowed(event, team, user, roles)) {

                // Replay it later
                if(!replayed) {
                    miitoo.logger.debug('The event will be replayed one time to be sure it\'s not a concurrency problem.');

                    setTimeout(function() {
                        this.dispatch(spark, event, data, true);
                    }.bind(this), 250);
                }
                return;
            }

            this.emit(event, spark, data, team, user, roles);
        }.bind(this));
    };
}

// Extend EventEmitter
Dispatcher.prototype.__proto__ = EventEmitter.prototype;

// Register the realtime dispatcher
miitoo.register('RealtimeDispatcher', new Dispatcher(), true);
