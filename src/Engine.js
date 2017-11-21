"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Player = {PLAYER_ONE : 0, PLAYER_TWO : 1};
Lyngk.InvalidStateForMove = [Lyngk.State.VACANT, Lyngk.State.FULL_STACK];

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

    var _fillBoardWithValidCoordinate = function(coordinate, pieces) {
        if (coordinate.isValid()) {
            _addIntersection(coordinate, pieces);
        }
    };

    var _fillBoard = function() {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        var pieces = _initPieces();

        // Construction du plateau
        for (var line = 1; line < 10; line++) {
            for (var i = 0; i < letters.length; i++) {
                var coordinate = new Lyngk.Coordinates(letters[i], line);
                _fillBoardWithValidCoordinate(coordinate, pieces);
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

    this.getIntersectionFromCoordinates = function(coordinates) {
        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i].getCoordinates().equals(coordinates)) {
                return intersections[i];
            }
        }

        return null;
    };

    this.getIntersectionAt = function(coordinates) {
        if (!coordinates.isValid()) {
            return null;
        }

        return this.getIntersectionFromCoordinates(coordinates);
    };

    this._fillPossibleMoves = function(sourceCol, sourceLine, moves) {
        var leftChar = String.fromCharCode(sourceCol.charCodeAt(0) - 1);
        var rightChar = String.fromCharCode(sourceCol.charCodeAt(0) + 1);

        // top
        moves.push(new Lyngk.Coordinates(sourceCol, sourceLine + 1));
        // bottom
        moves.push(new Lyngk.Coordinates(sourceCol, sourceLine - 1));
        // top left
        moves.push(new Lyngk.Coordinates(leftChar, sourceLine));
        // top right
        moves.push(new Lyngk.Coordinates(rightChar, sourceLine + 1));
        // bottom left
        moves.push(new Lyngk.Coordinates(leftChar, sourceLine - 1));
        // bottom right
        moves.push(new Lyngk.Coordinates(rightChar, sourceLine));
    };

    this._getValidMovesFrom = function(source) {
        var sourceCol = source.getCoordinates().getColonne();
        var sourceLine = source.getCoordinates().getLigne();
        var moves = [];

        this._fillPossibleMoves(sourceCol, sourceLine, moves);
        return moves;
    };

    this._checkStatesForMove = function(source, dest) {
        if (source.getState() === Lyngk.State.ONE_PIECE &&
            dest.getState() > Lyngk.State.ONE_PIECE) {
            return false;
        }

        return Lyngk.InvalidStateForMove.indexOf(source.getState()) === -1 &&
            Lyngk.InvalidStateForMove.indexOf(dest.getState()) === -1;
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

    this._isAllowedToMovePieces = function(source) {
        if (source.getColor() === Lyngk.Color.WHITE) {
            return true;
        }

        var player = (currentPlayer === Lyngk.Player.PLAYER_ONE);
        return !this._intersectionHasPlayerColors(source, !player);
    };

    this._isValidMove = function(source, dest) {
        return this._checkStatesForMove(source, dest) &&
            this._isAllowedToMovePieces(source) &&
            this._checkHeightsForMove(source, dest) &&
            this._checkColorsForMove(source, dest) &&
            this._canMoveTo(source, dest);
    };

    this._checkIntersectionsForMove = function(interSource, interDest) {
        return Lyngk.areValidObjects(interSource, interDest) &&
            this._isValidMove(interSource, interDest);
    };

    this._updateTurn = function(interDest) {
        this._updatePoints(interDest);
        this._nextPlayer();
    };

    this._intersectionHasPlayerColors = function(intersection, isPlayerOne) {
        if (isPlayerOne) {
            return playerOneColors.indexOf(intersection.getColor()) !== -1;
        }

        return playerTwoColors.indexOf(intersection.getColor()) !== -1;
    };

    this._updatePlayerPoints = function(isPlayerOne, interDest) {
        if (this._intersectionHasPlayerColors(interDest, isPlayerOne)) {
            if (isPlayerOne) {
                playerOnePoints++;
            } else {
                playerTwoPoints++;
            }

            interDest.stripPieces();
        }
    };

    this._updatePoints = function(interDest) {
        if (interDest.getState() !== Lyngk.State.FULL_STACK) {
            return;
        }

        var isPlayerOne = currentPlayer === Lyngk.Player.PLAYER_ONE;
        this._updatePlayerPoints(isPlayerOne, interDest);
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

    this._checkClaimColors = function(playerColors, otherColors, color) {
        return playerColors.indexOf(color) === -1 &&
            otherColors.indexOf(color) === -1 &&
            playerColors.length < 2;
    };

    this._canClaim = function(player, color) {
        if (currentPlayer !== player) { return false; }

        if (currentPlayer === Lyngk.Player.PLAYER_ONE) {
            return this._checkClaimColors(playerOneColors,
                playerTwoColors, color);
        }

        return this._checkClaimColors(playerTwoColors, playerOneColors, color);
    };

    this.claim = function(player, color) {
        if (!this._canClaim(player, color)) {
            return false;
        }

        if (currentPlayer === Lyngk.Player.PLAYER_ONE) {
            playerOneColors.push(color);
        } else {
            playerTwoColors.push(color);
        }

        return true;
    };

    this.getCurrentPlayerMovesCount = function() {
        var count = 0;
        var isP1 = currentPlayer === Lyngk.Player.PLAYER_ONE;

        for (var i = 0; i < intersections.length; i++) {
            if (intersections[i].getState() !== Lyngk.State.VACANT &&
                intersections[i].getColor() !== Lyngk.Color.WHITE &&
                !this._intersectionHasPlayerColors(intersections[i], !isP1)) {
                count++;
            }
        }

        return count;
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