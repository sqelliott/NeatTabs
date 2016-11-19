describe("Session", function() {
    var Tab = require('../lib/tab');
    var Session = require('../lib/session');
    var Timer = require('../lib/timer');

    var tab;
    var session;
    var timer;

    beforeEach(function() {
        tab = new Tab();
        session = new Session();
        timer = new Timer();
    });

    it("should be able to track time spent on a domain", function() {
        timer.track(tab);
        expect(player.currentlyPlayingSong).toEqual(song);
        expect(timer.tracking).toEqual(domain);

        //demonstrates use of custom matcher
        expect(timer).toBeTracking(tab);
    });
});
