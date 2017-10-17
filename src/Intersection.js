"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function (c) {
    var state = Lyngk.State.VACANT;
    var piece;
    var coordinates = c;
    var pieceCount = 0;

    this.getState = function() {
        return state;
    };

    this.poserPiece = function(p) {
        piece = p;
        pieceCount++;

        this.updateState();
    };

    this.getColor = function() {
      if (piece !== null && piece !== undefined)
          return piece.getColor();
    };

    this.updateState = function() {
        if (pieceCount === 1) {
          state = Lyngk.State.ONE_PIECE;
        } else if (pieceCount === 2) {
            state = Lyngk.State.STACK;
        }
    };
};
