"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};
Lyngk.StateRange = {};
Lyngk.StateRange[0] = Lyngk.State.VACANT;
Lyngk.StateRange[1] = Lyngk.State.ONE_PIECE;
Lyngk.StateRange[2] = Lyngk.State.STACK;
Lyngk.StateRange[3] = Lyngk.State.STACK;
Lyngk.StateRange[4] = Lyngk.State.STACK;
Lyngk.StateRange[5] = Lyngk.State.FULL_STACK;


Lyngk.Intersection = function (c) {
    var state = Lyngk.State.VACANT;
    var coordinates = c;
    var stack = new Lyngk.Stack();

    this.getState = function () {
        return state;
    };

    this.poserPiece = function (p) {
        stack.pushPiece(p);
        this.updateState();
    };

    this.takeOffPiece = function () {
        var piece = stack.pop();
        this.updateState();

        return piece;
    };

    this.stripPieces = function () {
        var pieces = stack.strip();
        this.updateState();
        return pieces;
    };

    this.getColor = function () {
        var headPiece = stack.getHead();

        if (headPiece !== null && headPiece !== undefined) {
            return headPiece.getColor();
        }
    };

    this.placePieces = function (arrayPieces) {
        for (var i = 0; i < arrayPieces.length; i++) {
            stack.pushPiece(arrayPieces[i]);
        }

        this.updateState();
    };

    this.updateState = function () {
        state = Lyngk.StateRange[stack.getHeight()];
    };

    this.getCoordinates = function () {
        return coordinates;
    };

    this.getStack = function () {
        return stack;
    };
};
