describe("Timer", function() {

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

    it("should be able to set a domain", function() {
        spyOn(timer, '_time');
        timer._setCurrent('https://test.com');
        expect(timer._domain).not.toEqual(null);
    });
});
