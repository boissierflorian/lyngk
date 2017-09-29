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