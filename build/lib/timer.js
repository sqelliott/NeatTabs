function Timer() {
}

Timer.prototype.track = function(value) {
    this.domain = value;
};

Timer.prototype.time = function() {
    this.time = true;
};

module.exports = Timer;
