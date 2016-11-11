function tab() {
}
tab.prototype.play = function(song) {
    this.currentlyPlayingSong = song;
    this.isPlaying = true;
};

tab.prototype.pause = function() {
    this.isPlaying = false;
};

tab.prototype.resume = function() {
    if (this.isPlaying) {
        throw new Error("song is already playing");
    }

    this.isPlaying = true;
};

tab.prototype.makeFavorite = function() {
    this.currentlyPlayingSong.persistFavoriteStatus(true);
};

module.exports = tab;
