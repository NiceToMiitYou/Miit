// Get event
var EventEmitter = require('events').EventEmitter;

// Define the Dispatcher
function Dispatcher() {

    // Roles needed to call this event
    var roles = {};

    // Define the emitter to this
    EventEmitter.call(this);

    // Getter for user
    function getUser(spark) {
        return (spark.request || {}).user || {};
    }

    // Getter for team
    function getTeam(spark) {
        return (spark.request || {}).team || {};
    }

    // Getter for team
    function isAllowed(spark, team, user, role) {
        var userRoles = ((spark.request || {}).roles || []);

        if(role === 'PUBLIC') {
            return true;
        }

        if(role === 'USER' && true === team.public && false === !user.id) {
            return userRoles.indexOf('ANONYM') != -1 ||
                   userRoles.indexOf('USER')   != -1
        }

        return userRoles.indexOf(role) != -1;
    }

    function getRoleForEvent(event) {
        return roles[event] || 'PUBLIC';
    }

    // Register 
    this.register = function(event, role, callback)
    {
        if(typeof callback === 'undefined') {
            callback = role;
            role     = 'PUBLIC';
        }

        console.log(event, role);

        // Register roles
        roles[event] = role;

        // Bind event
        this.on(event, callback);
    }

    // Dispacth an event
    this.dispatch = function(spark, event, data, replayed)
    {
        var user = getUser(spark);
        var team = getTeam(spark);
        var role = getRoleForEvent(event);

        // Check if he has the rigth access
        if(false === isAllowed(spark, team, user, role)) {

            miitoo.logger.debug('The user has been blocked. Needed role:', role, '- Action:', event);

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
    }
}

// Extend EventEmitter
Dispatcher.prototype.__proto__ = EventEmitter.prototype;

// Register the realtime dispatcher
miitoo.register('RealtimeDispatcher', new Dispatcher(), true);
