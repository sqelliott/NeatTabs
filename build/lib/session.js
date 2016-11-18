function session() {
}

session.prototype.is_saved = function() {
	this.saved = true;
};

module.exports = session;
