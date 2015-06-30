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
        return spark.request.user || {};
    }

    // Getter for team
    function getTeam(spark) {
        return spark.request.team || {};
    }

    // Getter for team
    function isAllowed(spark, role) {
        if(role === 'PUBLIC') {
            return true;
        }

        return (spark.request.roles || []).indexOf(role) != -1;
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

        // Register roles
        roles[event] = role;

        // Bind event
        this.on(event, callback);
    }

    // Dispacth an event
    this.dispatch = function(spark, event, data)
    {
        var user = getUser(spark);
        var team = getTeam(spark);
        var role = getRoleForEvent(event);

        miitoo.logger.debug('Needed role:', role);

        if(false === isAllowed(spark, role)) {

            miitoo.logger.debug('The user has been blocked.');
            return;
        }

        this.emit(event, spark, data, team, user);
    }
}

// Extend EventEmitter
Dispatcher.prototype.__proto__ = EventEmitter.prototype;

// Register the realtime dispatcher
miitoo.register('RealtimeDispatcher', new Dispatcher(), true);
