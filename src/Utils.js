"use strict";

Lyngk.isValidObject = function(o) {
    return o !== undefined && o !== null;
};

Lyngk.areValidObjects = function() {
    for (var i = 0; i < arguments.length; i++) {
        if (!Lyngk.isValidObject(arguments[i])) {
            return false;
        }
    }

    return true;
};