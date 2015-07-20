'use strict';

var SubscriptionsConstants = {
    ActionTypes: KeyMirror({
        // Subscriptions Actions
        REFRESH_SUBSCRIPTIONS: null,

        // Mark as Read
        MARK_READ_APPLICATION: null,
        MARK_READ_SENDER: null
    })
};

module.exports = SubscriptionsConstants;