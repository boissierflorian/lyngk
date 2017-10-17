"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function () {
    var intersections = [];

    var init = function() {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        // Construction du plateau
        for (var line = 1; line < 10; line++) {
            for (var i = 0; i < letters.length; i++) {
                var coordinate = new Lyngk.Coordinates(letters[i], line);
                var intersection = new Lyngk.Intersection(coordinate);
                var piece = new Lyngk.Piece(Lyngk.Color.WHITE);

                intersection.poserPiece(piece);
                intersections.push(intersection);
            }
        }
    };

    this.getIntersections = function() {
      return intersections;
    };

    init();
};
