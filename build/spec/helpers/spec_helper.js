beforeEach(function () {
    jasmine.addMatchers({
        toBeTracking: function () {
            return {
                compare: function (actual, expected) {
                    var player = actual;

                    return {
                        pass: player.currentlyPlayingSong === expected && player.isPlaying
                    }
                }
            };
        }
    });
});
