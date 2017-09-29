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