function Session() {
}
Session.prototype.play = function(song) {
    this.currentlyPlayingSong = song;
    this.isPlaying = true;
};

Session.prototype.pause = function() {
    this.isPlaying = false;
};

Session.prototype.resume = function() {
    if (this.isPlaying) {
        throw new Error("song is already playing");
    }

    this.isPlaying = true;
};

Session.prototype.makeFavorite = function() {
    this.currentlyPlayingSong.persistFavoriteStatus(true);
};

module.exports = Session;
