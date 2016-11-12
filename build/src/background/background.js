var pollInterval = 1000 * 60; // 1 minute, in milliseconds
var timerId;

function startRequest() {
    updateBadge();
    timerId = window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
    window.clearTimeout(timerId);
}