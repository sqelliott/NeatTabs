function Timer() {
}

Timer.prototype.track = function(url) {
    this.domain = url;
};

Timer.prototype.time = function() {
    this.time = true;
};

module.exports = Timer;
