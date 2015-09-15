
var timeoutId, primus, InvitationStore, UserManager;

// Variables for waiting
var currentWait = 1000;
var minWait     = 100,
    maxWait     = 60000;

// Max requested status
var maxInvitations = 10;

// Function to redefine waiting time
function recalculateTime(done) {
    var newTime = currentWait;

    var value = maxInvitations / 2;
    var coef  = (value - done) / value;

    newTime += newTime * coef;

    // Set the new wait time
    currentWait = (newTime > maxWait) ? maxWait : // If superior to maxtime
                  (newTime < minWait) ? minWait : // If inferior to mintime
                                        Math.round(newTime);
}

function endOfWorker(invitationsDone) {
    miitoo.logger.info('End of InvitationWorker.');

    // Recalculate waiting time
    recalculateTime(invitationsDone);

    miitoo.logger.debug('Invitations send:', invitationsDone, 'Next check in:', currentWait + 'ms');

    // restart the worker after 5sec
    timeoutId = setTimeout(InvitationWorker, currentWait);
}

// The worker
function InvitationWorker() {
    miitoo.logger.info('Running InvitationWorker...');

    var invitationsDone = 0;

    InvitationStore.getInvitationsNotSent(maxInvitations, function(err, invitations) {
        if(err) {
            return;
        }

        invitations.forEach(function(invitation) {

            var token = invitation.token,
                team  = invitation.team,
                email = invitation.email;

            var owner = -1 !== invitation.roles.indexOf('OWNER');

            UserManager.invite(team, token, email, owner);

            invitation.send = true;
            invitation.save();

            invitationsDone++;
        });


        endOfWorker(invitationsDone);
    });
}

// Start worker after initialisation
miitoo.once('after:start', function() {    

    // Load primus
    primus = miitoo.get('Primus');

    // Load the store
    InvitationStore = miitoo.get('InvitationStore');
    UserManager     = miitoo.get('UserManager');

    // Run one time the worker
    timeoutId = setTimeout(InvitationWorker, currentWait);
});

// Stop worker before stop
miitoo.once('before:stop', function() {    

    // Stop the worker
    clearTimeout(timeoutId);

    miitoo.logger.info('InvitationWorker Stopped.');
});