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

    this.takeOffPiece = function() {
      var piece = stack.pop();
      this.updateState();

      return piece;
    };

    this.stripPieces = function() {
        var pieces = stack.strip();
        this.updateState();
        return pieces;
    };

    this.getColor = function() {
        var headPiece = stack.getHead();

        if (headPiece !== null && headPiece !== undefined)
          return headPiece.getColor();
    };

    this.placePieces = function(arrayPieces) {
        for (var i = 0; i < arrayPieces.length; i++) {
            stack.pushPiece(arrayPieces[i]);
        }

        this.updateState();
    };

    this.updateState = function() {
        var pieceCount = stack.getHeight();

        if (pieceCount === 1) {
          state = Lyngk.State.ONE_PIECE;
        } else if (pieceCount > 1 && pieceCount < 5) {
            state = Lyngk.State.STACK;
        } else if (pieceCount === 5) {
            state = Lyngk.State.FULL_STACK;
        } else if (pieceCount === 0) {
            state = Lyngk.State.VACANT;
        }
    };

    this.getCoordinates = function() {
        return coordinates;
    };

    this.getStack = function() {
        return stack;
    }
};
