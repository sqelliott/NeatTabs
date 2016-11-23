function Session() {
}

Session.prototype.save = function() {
    this.save = true;
};

Session.prototype.restore = function() {
    this.restore = true;
};

Session.prototype.clear = function() {
    this.tabs = null;
};

Session.prototype.add = function(tab) {
    this.tabs += tab;
};

module.exports = Session;
