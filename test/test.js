'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

LyngkTestCase.prototype.testStory1 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertFalse(coordinates.isValid());
};

LyngkTestCase.prototype.testStory2 = function() {
    var validCoordinates = 0;
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    for (var ligne = 1; ligne < 10; ligne++) {
        for (var i = 0; i < letters.length; i++) {
            var coordinates = new Lyngk.Coordinates(letters[i], ligne);

            if (coordinates.isValid()) {
                validCoordinates++;
            }
        }
    }

    assertTrue(validCoordinates === 43);
};

LyngkTestCase.prototype.testStory3 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    assertTrue(coordinates.getRepresentation() === "A3");
};

LyngkTestCase.prototype.testStory4 = function () {
    var coordinates = new Lyngk.Coordinates("A", 1);
    assertTrue(coordinates.getRepresentation() === "invalid");
};

LyngkTestCase.prototype.testStory5 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var copy = coordinates.clone();

    assertTrue(coordinates.getColonne() === copy.getColonne() && coordinates.getLigne() === copy.getLigne());
};

LyngkTestCase.prototype.testStory6 = function() {
    var hashCodes = [];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    for (var ligne = 1; ligne < 10; ligne++) {
        for (var i = 0; i < letters.length; i++) {
            var coordinates = new Lyngk.Coordinates(letters[i], ligne);
            var hash = coordinates.hash();

            assertTrue(hashCodes.indexOf(hash) === -1);
            hashCodes.push(hash);
        }
    }
};

LyngkTestCase.prototype.testStory7 = function() {
    var coordinates = new Lyngk.Coordinates("C", 2);
    var intersection = new Lyngk.Intersection(coordinates);

    assertTrue(intersection.getState() === Lyngk.State.VACANT);
};

LyngkTestCase.prototype.testStory8 = function() {
    var coordinates = new Lyngk.Coordinates("C", 2);
    var intersection = new Lyngk.Intersection(coordinates);
    var piece = new Lyngk.Piece(Lyngk.Color.BLUE);

    intersection.poserPiece(piece);

    assertTrue(intersection.getState() === Lyngk.State.ONE_PIECE);
    assertTrue(intersection.getColor() === Lyngk.Color.BLUE);
};

LyngkTestCase.prototype.testStory9 = function() {
    var coordinates = new Lyngk.Coordinates("C", 2);
    var intersection = new Lyngk.Intersection(coordinates);
    var bluePiece = new Lyngk.Piece(Lyngk.Color.BLUE);
    var redPiece = new Lyngk.Piece(Lyngk.Color.RED);

    intersection.poserPiece(bluePiece);
    assertTrue(intersection.getColor() === Lyngk.Color.BLUE);

    intersection.poserPiece(redPiece);
    assertTrue(intersection.getColor() === Lyngk.Color.RED);

    assertTrue(intersection.getState() === Lyngk.State.STACK);
};

LyngkTestCase.prototype.testStory10 = function() {
    var coordinates = new Lyngk.Coordinates("C", 2);
    var intersection = new Lyngk.Intersection(coordinates);
    var bluePiece = new Lyngk.Piece(Lyngk.Color.BLUE);
    var redPiece = new Lyngk.Piece(Lyngk.Color.RED);
    var greenPiece = new Lyngk.Piece(Lyngk.Color.GREEN);
    var ivoryPiece = new Lyngk.Piece(Lyngk.Color.IVORY);
    var whitePiece = new Lyngk.Piece(Lyngk.Color.WHITE);

    intersection.poserPiece(bluePiece);
    intersection.poserPiece(redPiece);
    intersection.poserPiece(greenPiece);
    intersection.poserPiece(ivoryPiece);
    intersection.poserPiece(whitePiece);

    assertTrue(intersection.getState() === Lyngk.State.FULL_STACK);
};