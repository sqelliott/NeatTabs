describe("Timer", function() {

    chrome = {
        pageAction: {
            show: function(){},
            onClicked: {
                addListener: function(){}
            }
        },
        storage: {
            local: {
                set: function() {},
                get: function() {}
            }
        }
    };

    var Timer = require('../src/background/timer');
    var timer;

    beforeEach(function() {
        timer = new Timer();
    });

    // Unit Test 1
    it("should be able to set a domain", function() {
        spyOn(timer, '_time');
        timer._setCurrent('https://test.com');
        expect(timer._domain).not.toEqual(null);
        console.log("Unit Test: Timer Domain - " + timer._domain);
    });

    // Unit Test 2
    it("should be able to save to storage", function() {
        timer._setCurrent('https://test.com');
        // timer._saveToStorage(timer);
        expect(timer._time).toBe(0);
        expect(timer._startTime).toEqual(new Date());
        expect(timer._domain).toBe('https://test.com');
    });
});
