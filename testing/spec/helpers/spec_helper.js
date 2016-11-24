beforeEach(function () {
    jasmine.addMatchers({
        toBeTracking: function () {
            return {
                compare: function (actual, expected) {
                    var timer = actual;

                    return {
                        pass: timer._domain === expected
                    }
                }
            };
        }
    });
});
