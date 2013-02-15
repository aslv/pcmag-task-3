CONST = {
    gridSize: 100,
    mapSize: 20,
    mapDimensions: 630,
    mapOffset: 15,
    mapOffsetNavigation: 30,
    borderRadius: 10,
    miniMapDimensions: 300,
    gold: 200,
    attackUnits: ['pig', 'bomb'],
    deffenceUnits: ['chicken', 'mine'],
    units: [{
        type: 'pig',
        price: 7,
        range: 1.5,
        min: 1,
        images: ['unitPig1', 'unitPig2', 'unitPig3', 'unitPig4', 'unitPig5', 'unitPig6', 'unitPig7', 'unitPig8', 'unitPig9'],
        attackPoints: function(n) {
            return 4 * n;
        }
    }, {
        type: 'chicken',
        price: 1,
        range: 2,
        min: 1,
        images: ['unitChicken1', 'unitChicken2', 'unitChicken3', 'unitChicken4', 'unitChicken5'],
        images: ['unitChicken1'],
        attackPoints: function(n) {
            return 2 * n - 1;
        }
    }, {
        type: 'mine',
        price: 5,
        range: 0,
        min: 1,
        max: 1,
        images: ['unitMine1'],
        attackPoints: 0
    }, {
        type: 'bomb',
        price: 10,
        range: 0,
        increaseRange: true,
        increaseRangePrice: 10,
        min: 1,
        max: 1,
        images: ['unitBomb1', 'unitBomb2'],
        attackPoints: 0
    }],
    images: {
        background: 'files/img/game/battlefield/background.jpg',
        gold: 'files/img/game/icons/gold.png',
        iconMine: 'files/img/game/icons/mine.png',
        iconChicken: 'files/img/game/icons/chicken.png',
        iconPig: 'files/img/game/icons/pig.png',
        iconBomb: 'files/img/game/icons/bomb.png',
        unitPig1: 'files/img/game/units/pigs/pig-1.png',
        unitPig2: 'files/img/game/units/pigs/pig-2.png',
        unitPig3: 'files/img/game/units/pigs/pig-3.png',
        unitPig4: 'files/img/game/units/pigs/pig-4.png',
        unitPig5: 'files/img/game/units/pigs/pig-5.png',
        unitPig6: 'files/img/game/units/pigs/pig-6.png',
        unitPig7: 'files/img/game/units/pigs/pig-7.png',
        unitPig8: 'files/img/game/units/pigs/pig-8.png',
        unitPig9: 'files/img/game/units/pigs/pig-9.png',
        unitChicken1: 'files/img/game/units/chickens/chicken-1.png',
        unitChicken2: 'files/img/game/units/chickens/chicken-2.png',
        unitChicken3: 'files/img/game/units/chickens/chicken-3.png',
        unitChicken4: 'files/img/game/units/chickens/chicken-4.png',
        unitChicken5: 'files/img/game/units/chickens/chicken-5.png',
        unitBomb1: 'files/img/game/units/bombs/bomb-1.png',
        unitBomb2: 'files/img/game/units/bombs/bomb-2.png',
        unitMine1: 'files/img/game/units/mines/mine-1.png'
    }

};
LANG = {
    tUnknownCommand: "Unknown command `%s`\nType `help` for help",
    tGreetings: "Hello",
    tIvalidArguments: "Invalid argument(s)\nType `%s -h` for help",
    tNewUnitSuccess: "[[;#0f0;]Unit(s) have been successfully added]",
    tUnitsErrorsOvercost: "Not enough money to process",
    tUnitsErrorsExtramural: "Coordinates not valid",
    tUnitsErrorsOverlap: "Coordinates alredy in use",
    tUnitsErrors: "[[;#0f0;]Unit(s) have been successfully added.]",
    tCoordinatesAreEmpty: "Nothing on these coordinates",
    tCoordinatesHasUnits: "%s unit(s) of type %s",
    '':""
};
