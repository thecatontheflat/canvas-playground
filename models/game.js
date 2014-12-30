var GameField = require('./game-field');

module.exports = function (io) {
    var Game = {
        pace: 1,
        objects: [],
        updateRequired: false,

        attachObject: function (object) {
            GameField.objects[object.id] = object;
        },

        moveObject: function (client, to) {
            var id = client['object_id'];
            var object = GameField.objects[id];

            object.toX = to.x;
            object.toY = to.y;
        },

        getRecalculatePositionCallback: function() {
            return function (object) {
                object.move();
                Game.updateRequired = true;
            };
        },

        serverLoop: function () {
            Game.updateRequired = false;
            GameField.objects.forEach(Game.getRecalculatePositionCallback());

            if (Game.updateRequired) {
                io.emit('render', GameField.objects);
            }
        },

        disconnect: function (client) {
            var newObjects = [];
            GameField.objects.forEach(function (object) {
                if (object.id != client['object_id']) {
                    newObjects[object.id] = object;
                }
            });

            GameField.objects = newObjects;
        }
    };

    return Game;
};
