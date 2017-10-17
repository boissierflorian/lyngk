"use strict";

Lyngk.invalidCoordinates = [
    "A1", "B1", "D1", "E1", "F1", "G1", "H1", "I1",
    "A2", "F2", "G2", "H2", "I2",
    "H3", "I3",
    "A4", "H4", "I4",
    "A5", "I5",
    "A6", "B6", "I6",
    "A7", "B7",
    "A8", "B8", "C8", "D8", "I8",
    "A9", "B9", "C9", "D9", "E9", "F9", "H9", "I9"
];

Lyngk.Coordinates = function (c, l) {
    var colonne = c;
    var ligne = l;

    this.isValid = function() {
        var coords = c + l;

        for (var i = 0; i < Lyngk.invalidCoordinates.length; i++) {
            if (Lyngk.invalidCoordinates[i] === coords)
                return false;
        }

        return true;
    };

    this.getRepresentation = function() {
        if (!this.isValid())
            return "invalid";

        return colonne + ligne;
    };

    this.clone = function() {
        var copy = new Lyngk.Coordinates(colonne, ligne);
        return copy;
    };

    this.getColonne = function() {
        return colonne;
    };

    this.getLigne = function () {
      return ligne;
    };

    this.hash = function() {
        return colonne.charCodeAt(0) + ligne * (4 * ligne) - 7;
    };

    this.equals = function(coordinate) {
        return colonne === coordinate.getColonne() && ligne === coordinate.getLigne();
    }
};
