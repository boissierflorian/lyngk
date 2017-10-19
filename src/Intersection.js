"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function (c) {
    var state = Lyngk.State.VACANT;
    var coordinates = c;
    var stack = new Lyngk.Stack();

    this.getState = function() {
        return state;
    };

    this.poserPiece = function(p) {
        stack.pushPiece(p);
        this.updateState();
    };

    this.getColor = function() {
        var headPiece = stack.getHead();

        if (headPiece !== null && headPiece !== undefined)
          return headPiece.getColor();
    };

    this.updateState = function() {
        var pieceCount = stack.getHeight();

        if (pieceCount === 1) {
          state = Lyngk.State.ONE_PIECE;
        } else if (pieceCount > 1 && pieceCount < 5) {
            state = Lyngk.State.STACK;
        } else if (pieceCount === 5) {
            state = Lyngk.State.FULL_STACK;
        }
    };

    this.getCoordinates = function() {
        return coordinates;
    };

    this.getStack = function() {
        return stack;
    }
};
