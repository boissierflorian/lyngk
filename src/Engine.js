"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Player = {PLAYER_ONE : 0, PLAYER_TWO : 1};

Lyngk.Engine = function () {
    var intersections = [];
    var currentPlayer = Lyngk.Player.PLAYER_ONE;
    var playerOneColors = [];
    var playerTwoColors = [];
    var playerOnePoints = 0;
    var playerTwoPoints = 0;

    var _getRandom = function(max) {
        return Math.floor(Math.random() * max);
    };

    var _initPieces = function() {
        var pieces = [];

        for (var i = 0; i < 8; i++) {
            pieces.push(new Lyngk.Piece(Lyngk.Color.RED));
            pieces.push(new Lyngk.Piece(Lyngk.Color.BLUE));
            pieces.push(new Lyngk.Piece(Lyngk.Color.BLACK));
            pieces.push(new Lyngk.Piece(Lyngk.Color.GREEN));
            pieces.push(new Lyngk.Piece(Lyngk.Color.IVORY));

            if (i < 3) {
                pieces.push(new Lyngk.Piece(Lyngk.Color.WHITE));
            }
        }

        return pieces;
    };

    var _addIntersection = function(coordinate, pieces) {
        var intersection = new Lyngk.Intersection(coordinate);
        var randomIndex = _getRandom(pieces.length);
        var piece = pieces[randomIndex];

        pieces.splice(randomIndex, 1);

        intersection.poserPiece(piece);
        intersections.push(intersection);
    };

    var _fillBoard = function() {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        var pieces = _initPieces();

        // Construction du plateau
        for (var line = 1; line < 10; line++) {
            for (var i = 0; i < letters.length; i++) {
                var coordinate = new Lyngk.Coordinates(letters[i], line);

                if (coordinate.isValid()) {
                    _addIntersection(coordinate, pieces);
                }
            }
        }
    };

    var init = function() {
        _fillBoard();
    };

    this.takeOffPiece = function(coordinates) {
        if (!coordinates.isValid()) {
            return null;
        }

        var intersection = this.getIntersectionAt(coordinates);
        if (intersection === null) {
            return null;
        }

        return intersection.takeOffPiece();
    };

    this.placePiece = function(piece, coordinates) {
        if (!coordinates.isValid()) {
            return false;
        }

        var intersection = this.getIntersectionAt(coordinates);
        if (intersection === null) {
            return false;
        }

        intersection.poserPiece(piece);
        return true;
    };

    this.getIntersectionAt = function(coordinates) {
        if (!coordinates.isValid()) {
            return null;
        }

        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i].getCoordinates().equals(coordinates)) {
                return intersections[i];
            }
        }

        return null;
    };

    this._getValidMovesFrom = function(source) {
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

        return moves;
    };

    this._checkStatesForMove = function(source, dest) {
        return !(source.getState() === Lyngk.State.VACANT || dest.getState() === Lyngk.State.VACANT ||
            source.getState() === Lyngk.State.FULL_STACK || dest.getState() === Lyngk.State.FULL_STACK ||
            (source.getState() === Lyngk.State.ONE_PIECE && dest.getState() > Lyngk.State.ONE_PIECE));
    };

    this._checkColorsForMove = function (source, dest) {
        var sourceStack = source.getStack();

        for (var i = 0; i < sourceStack.getPieces().length; i++) {
            var sourceColor = sourceStack.getPieces()[i].getColor();
            if (dest.getStack().containsColor(sourceColor) && sourceColor !==
                Lyngk.Color.WHITE) {
                return false;
            }
        }

        return true;
    };

    this._canMoveTo = function(source, dest) {
        var moves = this._getValidMovesFrom(source);

        for (var i = 0; i < moves.length; i++) {
            if (moves[i].equals(dest.getCoordinates()) && moves[i].isValid()) {
                return true;
            }
        }

        return false;
    };

    this._checkHeightsForMove = function(source, dest) {
        return source.getStack().getHeight() >= dest.getStack().getHeight();
    };

    this._isValidMove = function(source, dest) {
        return this._checkStatesForMove(source, dest) && this._checkHeightsForMove(source, dest) &&
            this._checkColorsForMove(source, dest) && this._canMoveTo(source, dest);
    };

    this._checkIntersectionsForMove = function(interSource, interDest) {
        if (interSource === null || interSource === undefined ||
            interDest === null || interDest === undefined) {
            return false;
        }

        return this._isValidMove(interSource, interDest);
    };

    this._updateTurn = function(interDest) {
        this._updatePoints(interDest);
        this._nextPlayer();
    };

    this._updatePoints = function(interDest) {
        if (interDest.getState() !== Lyngk.State.FULL_STACK) { return; }
        var colors = (currentPlayer === Lyngk.Player.PLAYER_ONE ?
            playerOneColors : playerTwoColors);

        for (var i = 0; i < colors.length; i++) {
            if (interDest.getColor() === colors[i]) {
                if (currentPlayer === Lyngk.Player.PLAYER_ONE) {
                    playerOnePoints++;
                } else {
                    playerTwoPoints++;
                }
                interDest.stripPieces();
                break;
            }
        }
    };

    this._nextPlayer = function() {
        if (currentPlayer === Lyngk.Player.PLAYER_ONE) {
            currentPlayer = Lyngk.Player.PLAYER_TWO;
        }
        else {
            currentPlayer = Lyngk.Player.PLAYER_ONE;
        }
    };

    this.movePiecesFromTo = function(source, dest) {
        var interSource = this.getIntersectionAt(source);
        var interDest = this.getIntersectionAt(dest);

        if (!this._checkIntersectionsForMove(interSource, interDest)) {
            return false;
        }

        interDest.placePieces(interSource.stripPieces());
        this._updateTurn(interDest);

        return true;
    };

    this.claim = function(player, color) {
        if (currentPlayer !== player) { return false; }

        var colors = currentPlayer === Lyngk.Player.PLAYER_ONE ?
            playerOneColors : playerTwoColors;
        var otherColors = currentPlayer === Lyngk.Player.PLAYER_ONE ?
            playerTwoColors : playerOneColors;

        if (colors.length === 2 || colors.indexOf(color) !== -1 ||
            otherColors.indexOf(color) !== -1){
            return false;
        }

        colors.push(color);
        return true;
    };


    this.getIntersections = function() {
        return intersections;
    };

    this.getCurrentPlayer = function() {
        return currentPlayer;
    };

    this.getPlayerPoints = function(player) {
        if (player === Lyngk.Player.PLAYER_ONE) {
            return playerOnePoints;
        }

        return playerTwoPoints;
    };

    this.getPiecesLeft = function() {
        var count = 0;

        for (var i = 0; i < intersections.length; i++) {
            count += intersections[i].getStack().getHeight();
        }

        return count;
    };

    init();
};