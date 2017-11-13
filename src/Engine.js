"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Player = {PLAYER_ONE : 0, PLAYER_TWO : 1};

Lyngk.Engine = function () {
    var intersections = [];
    var currentPlayer = Lyngk.Player.PLAYER_ONE;

    var _getRandom = function(max) {
        return Math.floor(Math.random() * max);
    };

    var _fillBoard = function() {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        var pieces = [];

        for (var i = 0; i < 8; i++) {
            pieces.push(new Lyngk.Piece(Lyngk.Color.RED));
            pieces.push(new Lyngk.Piece(Lyngk.Color.BLUE));
            pieces.push(new Lyngk.Piece(Lyngk.Color.BLACK));
            pieces.push(new Lyngk.Piece(Lyngk.Color.GREEN));
            pieces.push(new Lyngk.Piece(Lyngk.Color.IVORY));

            if (i < 3)
                pieces.push(new Lyngk.Piece(Lyngk.Color.WHITE));

        }

        // Construction du plateau
        for (var line = 1; line < 10; line++) {
            for (i = 0; i < letters.length; i++) {
                var coordinate = new Lyngk.Coordinates(letters[i], line);

                if (coordinate.isValid()) {
                    var intersection = new Lyngk.Intersection(coordinate);
                    var randomIndex = _getRandom(pieces.length);
                    var piece = pieces[randomIndex];

                    pieces.splice(randomIndex, 1);

                    intersection.poserPiece(piece);
                    intersections.push(intersection);
                }
            }
        }
    };

    var init = function() {
        _fillBoard();
    };

    this.takeOffPiece = function(coordinates) {
        if (!coordinates.isValid()) return null;

        var intersection = this.getIntersectionAt(coordinates);
        if (intersection === null) return null;

        return intersection.takeOffPiece();
    };

    this.placePiece = function(piece, coordinates) {
        if (!coordinates.isValid()) return false;

        var intersection = this.getIntersectionAt(coordinates);
        if (intersection === null) return false;

        intersection.poserPiece(piece);
        return true;
    };

    this.getIntersectionAt = function(coordinates) {
        if (!coordinates.isValid())
            return null;

        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i].getCoordinates().equals(coordinates)) {
                return intersections[i];
            }
        }

        return null;
    };

    this._isValidMove = function(source, dest) {
        if (source.getState() === Lyngk.State.VACANT || dest.getState() === Lyngk.State.VACANT ||
            source.getState() === Lyngk.State.FULL_STACK || dest.getState() === Lyngk.State.FULL_STACK ||
            (source.getState() === Lyngk.State.ONE_PIECE && dest.getState() > Lyngk.State.ONE_PIECE))
            return false;

        if ((source.getStack().getHeight() < dest.getStack().getHeight()))
            return false;

        var sourceStack = source.getStack();
        for (i = 0; i < sourceStack.getPieces().length; i++) {
            if (dest.getStack().containsColor(sourceStack.getPieces()[i].getColor()) &&
                sourceStack.getPieces()[i].getColor() !== Lyngk.Color.WHITE)
                return false;
        }

        var sourceCol = source.getCoordinates().getColonne();
        var sourceLine = source.getCoordinates().getLigne();
        var moves = [];

        // top
        moves.push(new Lyngk.Coordinates(sourceCol, sourceLine + 1));
        // bottom
        moves.push(new Lyngk.Coordinates(sourceCol, sourceLine - 1));
        // top left
        moves.push(new Lyngk.Coordinates(String.fromCharCode(sourceCol.charCodeAt(0) - 1), sourceLine));
        // top right
        moves.push(new Lyngk.Coordinates(String.fromCharCode(sourceCol.charCodeAt(0) + 1), sourceLine + 1));
        // bottom left
        moves.push(new Lyngk.Coordinates(String.fromCharCode(sourceCol.charCodeAt(0) - 1), sourceLine - 1));
        // bottom right
        moves.push(new Lyngk.Coordinates(String.fromCharCode(sourceCol.charCodeAt(0) + 1), sourceLine));

        for (var i = 0; i < moves.length; i++) {
            if (moves[i].equals(dest.getCoordinates()) && moves[i].isValid()) return true;
        }

        return false;
    };

    this.movePiecesFromTo = function(source, dest) {
        var interSource = this.getIntersectionAt(source);
        var interDest = this.getIntersectionAt(dest);

        if (interSource === null || interSource === undefined ||
            interDest === null || interDest === undefined)
            return false;

        if (!this._isValidMove(interSource, interDest)) return false;
        if (currentPlayer === Lyngk.Player.PLAYER_ONE) currentPlayer = Lyngk.Player.PLAYER_TWO;
        else currentPlayer = Lyngk.Player.PLAYER_ONE;

        interDest.placePieces(interSource.stripPieces());
        return true;
    };


    this.getIntersections = function() {
      return intersections;
    };

    this.getCurrentPlayer = function() {
        return currentPlayer;
    };

    init();
};
