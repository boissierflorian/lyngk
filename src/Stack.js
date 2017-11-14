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
        if (pieces.length > 0) {
            return pieces[pieces.length - 1];
        }

        return null;
    };

    this.pop = function() {
        var piece = this.getHead();
        if (piece === null) { return null; }

        pieces.splice(pieces.length - 1, 1);
        return piece;
    };

    this.strip = function() {
        if (pieces.length === 0) {
            return null;
        }

        return pieces.splice(0, pieces.length);
    };

    this.containsColor = function(color) {
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.getColor() === color) {
                return true;
            }
        }

        return false;
    };

    this.getPieces = function() {
        return pieces;
    };
};