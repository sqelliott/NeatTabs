describe("Session", function() {

    chrome = {
        pageAction: {
            show: function(){},
            onClicked: {
                addListener: function(){}
            }
        }
    };

    var Tab = require('../lib/tab');
    var Session = require('../lib/session');
    var Timer = require('../src/background/timer');

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
        expect(timer.domain).toEqual(tab);
        expect(timer).toBeTracking(tab);
    });
});
