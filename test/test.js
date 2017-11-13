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

LyngkTestCase.prototype.testStory11 = function() {
    var engine = new Lyngk.Engine();
    var intersections = engine.getIntersections();
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    // On s'assure que le plateau est entièrement rempli
    for (var line = 1; line < 10; line++) {
        for (var i = 0; i < letters.length; i++) {
            var coordinate = new Lyngk.Coordinates(letters[i], line);

            if (!coordinate.isValid())
                continue;

            var found = false;

            for (var j = 0; j < intersections.length; j++) {
                if (intersections[j].getCoordinates().equals(coordinate)) {
                    // On s'assure également que chaque intersection ne possède qu'une et
                    // une seule pièce
                    assertTrue(intersections[j].getState() === Lyngk.State.ONE_PIECE);
                    found = true;
                    break;
                }
            }

            assertTrue(found);
        }
    }
};

LyngkTestCase.prototype.testStory12 = function() {
    var engine = new Lyngk.Engine();
    var intersections = engine.getIntersections();

    var whiteCount = 0;
    var redCount = 0;
    var blueCount = 0;
    var greenCount = 0;
    var ivoryCount = 0;
    var blackCount = 0;

    for (var i = 0; i < intersections.length; i++) {
        var color = intersections[i].getColor();

        if (color === Lyngk.Color.WHITE)
            whiteCount++;
        else if (color === Lyngk.Color.GREEN)
            greenCount++;
        else if (color === Lyngk.Color.BLUE)
            blueCount++;
        else if (color === Lyngk.Color.BLACK)
            blackCount++;
        else if (color === Lyngk.Color.IVORY)
            ivoryCount++;
        else if (color === Lyngk.Color.RED)
            redCount++;
    }

    assertEquals(3, whiteCount);
    assertEquals(8, redCount);
    assertEquals(8, blueCount);
    assertEquals(8, greenCount);
    assertEquals(8, ivoryCount);
    assertEquals(8, blackCount);
};

LyngkTestCase.prototype.testStory13 = function () {
    var engine = new Lyngk.Engine();
    var intersections = engine.getIntersections();

    for (var i = 0; i < intersections.length; i++) {
        assertEquals(1, intersections[i].getStack().getHeight());
    }
};

LyngkTestCase.prototype.testStory14 = function () {
    var engine = new Lyngk.Engine();
    var intersections = engine.getIntersections();

    intersections[0].poserPiece(new Lyngk.Piece(Lyngk.Color.IVORY));
    intersections[1].poserPiece(new Lyngk.Piece(Lyngk.Color.IVORY));
    intersections[2].poserPiece(new Lyngk.Piece(Lyngk.Color.IVORY));


    for (var i = 0; i < intersections.length; i++) {
        assertTrue(intersections[i].getStack().getHeight() >= 1);

        intersections[i].poserPiece(new Lyngk.Piece(Lyngk.Color.WHITE));
        assertTrue(intersections[i].getColor() === Lyngk.Color.WHITE);

        intersections[i].poserPiece(new Lyngk.Piece(Lyngk.Color.RED));
        assertTrue(intersections[i].getColor() === Lyngk.Color.RED);

        if (i > 2)
            assertEquals(3, intersections[i].getStack().getHeight());
        else
            assertEquals(4, intersections[i].getStack().getHeight());
    }
};

LyngkTestCase.prototype.testStory15 = function() {
    var engine = new Lyngk.Engine();

    var piece = engine.takeOffPiece(new Lyngk.Coordinates("A", 3));
    assertTrue(piece !== null && piece !== undefined);

    engine.placePiece(piece, new Lyngk.Coordinates("B", 3));

    var interB3 = engine.getIntersectionAt(new Lyngk.Coordinates("B", 3));
    assertTrue(interB3 !== null && interB3 !== undefined);
    assertTrue(interB3.getColor() === piece.getColor());

    var interA3 = engine.getIntersectionAt(new Lyngk.Coordinates("A", 3));
    assertTrue(interA3 !== null && interA3 !== undefined);
    assertTrue(interA3.getState() === Lyngk.State.VACANT && interA3.getStack().getHeight() === 0);
};

LyngkTestCase.prototype.testStory16 = function() {
    var engine = new Lyngk.Engine();
    engine.placePiece(new Lyngk.Piece(Lyngk.Color.GREEN), new Lyngk.Coordinates("B", 3));

    var interB3 = engine.getIntersectionAt(new Lyngk.Coordinates("B", 3));
    var colorB3 = interB3.getColor();
    var interB2 = engine.getIntersectionAt(new Lyngk.Coordinates("B", 2));

    assertEquals(1, interB2.getStack().getHeight());
    engine.movePiecesFromTo(new Lyngk.Coordinates("B", 3), new Lyngk.Coordinates("B", 2));
    assertEquals(3, interB2.getStack().getHeight());

    assertEquals(colorB3, interB2.getColor());
    assertTrue(interB3.getStack().getHeight() === 0 && interB3.getState() === Lyngk.State.VACANT);
};

LyngkTestCase.prototype.testStory17 = function() {
    var engine = new Lyngk.Engine();
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("B", 2), new Lyngk.Coordinates("B", 3)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("B", 3), new Lyngk.Coordinates("B", 2)));
    assertEquals(Lyngk.State.STACK, engine.getIntersectionAt(new Lyngk.Coordinates("B", 3)).getState());
    assertEquals(Lyngk.State.VACANT, engine.getIntersectionAt(new Lyngk.Coordinates("B", 2)).getState());
};

LyngkTestCase.prototype.testStory18 = function() {
    var engine = new Lyngk.Engine();
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("B", 2), new Lyngk.Coordinates("B", 3)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("B", 3), new Lyngk.Coordinates("C", 2)));
    assertEquals(Lyngk.State.STACK, engine.getIntersectionAt(new Lyngk.Coordinates("B", 3)).getState());
    assertEquals(Lyngk.State.ONE_PIECE, engine.getIntersectionAt(new Lyngk.Coordinates("C", 2)).getState());
};

LyngkTestCase.prototype.testStory19 = function() {
    var engine = new Lyngk.Engine();

    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("I", 7), new Lyngk.Coordinates("H", 6)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("H", 6), new Lyngk.Coordinates("H", 5)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("H", 5), new Lyngk.Coordinates("H", 8)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("H", 5), new Lyngk.Coordinates("F", 3)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("H", 5), new Lyngk.Coordinates("F", 5)));

    assertEquals(Lyngk.State.STACK, engine.getIntersectionAt(new Lyngk.Coordinates("H", 5)).getState());
    assertEquals(Lyngk.State.ONE_PIECE, engine.getIntersectionAt(new Lyngk.Coordinates("H", 8)).getState());
    assertEquals(Lyngk.State.ONE_PIECE, engine.getIntersectionAt(new Lyngk.Coordinates("F", 3)).getState());
    assertEquals(Lyngk.State.ONE_PIECE, engine.getIntersectionAt(new Lyngk.Coordinates("F", 5)).getState());
};

LyngkTestCase.prototype.testStory20 = function() {
    var engine = new Lyngk.Engine();

    engine.placePiece(new Lyngk.Piece(Lyngk.Color.WHITE), new Lyngk.Coordinates("B", 2));
    engine.placePiece(new Lyngk.Piece(Lyngk.Color.RED), new Lyngk.Coordinates("B", 2));

    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("B", 2), new Lyngk.Coordinates("C", 2)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("C", 2), new Lyngk.Coordinates("D", 2)));

    assertEquals(5, engine.getIntersectionAt(new Lyngk.Coordinates("D", 2)).getStack().getHeight());
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("D", 2), new Lyngk.Coordinates("E", 2)));
};

LyngkTestCase.prototype.testStory21 = function() {
    var engine = new Lyngk.Engine();

    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("A", 3), new Lyngk.Coordinates("B", 3)));
    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("C", 3), new Lyngk.Coordinates("B", 3)));

    assertEquals(Lyngk.State.STACK, engine.getIntersectionAt(new Lyngk.Coordinates("B", 3)).getState());
    assertEquals(Lyngk.State.ONE_PIECE, engine.getIntersectionAt(new Lyngk.Coordinates("C", 3)).getState());
};

LyngkTestCase.prototype.testStory22 = function() {
    var engine = new Lyngk.Engine();

    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("I", 7), new Lyngk.Coordinates("H", 6)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("G", 4), new Lyngk.Coordinates("G", 5)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("G", 5), new Lyngk.Coordinates("G", 6)));

    assertFalse(engine.movePiecesFromTo(new Lyngk.Coordinates("H", 6), new Lyngk.Coordinates("G", 6)));

    assertEquals(2, engine.getIntersectionAt(new Lyngk.Coordinates("H", 6)).getStack().getHeight());
    assertEquals(3, engine.getIntersectionAt(new Lyngk.Coordinates("G", 6)).getStack().getHeight());
};

LyngkTestCase.prototype.testStory23 = function() {
    Math.seedrandom("isidisi2l");
    var engine = new Lyngk.Engine();

    assertEquals(Lyngk.Color.WHITE, engine.getIntersectionAt(new Lyngk.Coordinates("D", 2)).getColor());
    assertEquals(Lyngk.Color.IVORY, engine.getIntersectionAt(new Lyngk.Coordinates("E",3)).getColor());
    assertEquals(Lyngk.Color.RED, engine.getIntersectionAt(new Lyngk.Coordinates("F", 4)).getColor());
    assertEquals(Lyngk.Color.WHITE, engine.getIntersectionAt(new Lyngk.Coordinates("G", 5)).getColor());
    assertEquals(Lyngk.Color.RED, engine.getIntersectionAt(new Lyngk.Coordinates("H", 6)).getColor());

    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("D", 2), new Lyngk.Coordinates("E", 3)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("E", 3), new Lyngk.Coordinates("F", 4)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("F", 4), new Lyngk.Coordinates("G", 5)));
    assertTrue(engine.movePiecesFromTo(new Lyngk.Coordinates("G", 5), new Lyngk.Coordinates("H", 6)));

    assertTrue(engine.getIntersectionAt(new Lyngk.Coordinates("H", 6)).getStack().getHeight() < 5);
};