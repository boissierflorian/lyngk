"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function () {
    var intersections = [];

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


    this.getIntersections = function() {
      return intersections;
    };

    init();
};
