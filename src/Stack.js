"use strict";

Lyngk.Stack = function() {
    var pieces = [];

    this.pushPiece = function(p) {
        pieces.push(p);
    };

    this.getHeight = function() {
        return pieces.length;
    };

    this.getHead = function() {
        if (pieces.length > 0)
            return pieces[pieces.length - 1];

        return null;
    };
};