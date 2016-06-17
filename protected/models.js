/**
 * Define models
 *
 * @param Chilly
 * @param config
 * @param helpers
 */
module.exports = function(Chilly, config, helpers) {
  'use strict';

  /**
   * Define game
   */
  var Game = Object.create({}, {
    id: {
      value: null,
      writable: true
    },
    players: {
      value: {},
      writable: true,
      enumerable: true
    },
    getRecipients: {
      value: function(player) {
        var rv = [];
        Object.keys(this.players).forEach(function(username) {
          rv.push(this.players[username].id);
        }, this);
        return rv;
      }
    },
    getPlayer: {
      value: function(username) {
        return this.players[username];
      }
    },
    addPlayer: {
      value: function(player) {
        this.players[player.username] = player;
      }
    },
    init: {
      value: function(id) {
        this.id = id;
      }
    }
  });

  /**
   * Export the models
   */
  return {
    Game: Game
  };
};
