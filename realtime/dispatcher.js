// Get event
var EventEmitter = require('events').EventEmitter;

// Getter for user
function getUser(spark) {
    return (spark.request || {}).user || {};
}

// Getter for team
function getTeam(spark) {
    return (spark.request || {}).team || {};
}

// Getter for user roles
function getRoles(spark) {
    return (spark.request || {}).roles || [];
}

// Getter for team
function isRoleAllowed(spark, team, user, role) {
    var userRoles = getRoles(spark);

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
function isApplicationAllowed(spark, team, application) {
    if(!application) {
        return true;
    }

    var userRoles = getRoles(spark);

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
    function isAllowed(spark, event, team, user) {
        // Retrieve informations
        var role        = getRoleForEvent(event);
        var application = getApplicationForEvent(event);

        var allowed = isApplicationAllowed(spark, team, application) &&
                      isRoleAllowed(spark, team, user, role);

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

    // Dispacth an event
    this.dispatch = function(spark, event, data, replayed)
    {
        var user = getUser(spark);
        var team = getTeam(spark);

        // Check if he has the rigth access
        if(false === isAllowed(spark, event, team, user)) {

            // Replay it later
            if(!replayed) {
                miitoo.logger.debug('The event will be replayed one time to be sure it\'s not a concurrency problem.');

                setTimeout(function() {
                    this.dispatch(spark, event, data, true);
                }.bind(this), 250);
            }
            return;
        }

        this.emit(event, spark, data, team, user);
    };
}

// Extend EventEmitter
Dispatcher.prototype.__proto__ = EventEmitter.prototype;

// Register the realtime dispatcher
miitoo.register('RealtimeDispatcher', new Dispatcher(), true);
