/**
 * Define actions
 *
 * @param Chilly
 * @param models
 * @param config
 * @param helpers
 */
module.exports = function(Chilly, models, config, helpers) {
  'use strict';

  /**
   * Define user channels (! MAX 5! )
   */
  Chilly.createChannel('chat');

  /**
   * Respond to a login request
   */
  Chilly.action('login', {
    user: function(request) {
      request.respond.error('Already logged in.');
    },
    anonymous: function(request) {
      var Game,
        username = request.data.username;

      // optional password check

      // add client to chilly
      Chilly.addClient(username);

      // create a game if not yet create, else add to an existing game
      // @change this functionality to accommodate your needs, a user must be in a game context (room)
      if (Object.keys(Chilly.Games).length === 0) {
        Game = Chilly.createGame();
      } else {
        Game = Chilly.Games[Object.keys(Chilly.Games)[0]];
      }

      // add player to the gamež
      // @change this to expand the player object with custom functionality
      Game.addPlayer({
        "username": username,
        "id": request.getClientId()
      });

      // set required session params
      request.session.set('auth', true);
      request.session.set('username', username);
      request.session.set('gameId', Game.id);
      // @add additional if needed

      // respond
      request.respond.ok('Authorization successful.');
    }
  });

  /**
   * Respond to a chat request
   */
  Chilly.action('sendChat', {
    user: function(request) {
      var Game = Chilly.getGame(request.session.get('gameId'));
      Chilly.push({
        recipients: Game.getRecipients(),
        channel: 'chat',
        data: {
          player: request.session.get('username'),
          message: request.data.message,
          datetime: new Date()
        }
      });
      request.respond.ok('Message sent.');
    }
  });

  /**
   * Respond to a sum request
   */
  Chilly.action('sum', {
    user: function(request) {
      var Game = Chilly.getGame(request.session.get('gameId'));
      Chilly.push({
        recipients: Game.getRecipients(),
        channel: 'update',
        data: {
          action: 'sum', // REQUIRED, must have the same name as the action
          value: request.data.number1 + request.data.number2,
          requestedBy: request.session.get('username')
        }
      });
      request.respond.ok('Message sent.');
    }
  });

  /**
   * Respond to a sum request
   */
  Chilly.action('multiply', {
    user: function(request) {
      var Game = Chilly.getGame(request.session.get('gameId'));
      Chilly.push({
        recipients: Game.getRecipients(),
        channel: 'update',
        data: {
          action: 'multiply', // REQUIRED, must have the same name as the action
          value: request.data.number1 * request.data.number2,
          requestedBy: request.session.get('username')
        }
      });
      request.respond.ok('Message sent.');
    }
  });
};
