window.onload = function() {

  BT.RemoteShipController = function() {
    var _this = this;
    this.assign = function(ship) {
      Chilly.onUpdate('remoteController', function(data) {
        console.log('Multiply update received.');
        console.log(data);
      });

      var keyAssignments = _this.getKeyAssignments(ship);
      for (var i = 0; i < keyAssignments.length; i++) {
        BT.Keyboard.onKeyDown(keyAssignments[i].key, keyAssignments[i].down);
        BT.Keyboard.onKeyUp(keyAssignments[i].key, keyAssignments[i].up);
      }
    };
  };

  BT.MainKeyboardRemoteShipController = new function() {
    var requestAction = function(action) {
      return function() {
        Chilly.request('remoteController', {
          data: {
            action: action
          }
        });
      }
    };
    BT.KeyboardShipController.apply(this, arguments);
    this.getKeyAssignments = function(ship) {
      return [
        {
          key: BT.Keys.W,
          down: requestAction("turnEngineOn"),
          up: requestAction("turnEngineOff")
        },
        {
          key: BT.Keys.A,
          down: requestAction("turnLeftBearingOn"),
          up: requestAction("turnLeftBearingOff")
        },
        {
          key: BT.Keys.D,
          down: requestAction("turnRightBearingOn"),
          up: requestAction("turnRightBearingOff")
        },
        {
          key: BT.Keys.Q,
          down: requestAction("turnCannonOn"),
          up: requestAction("turnCannonOff")
        }
      ];
    }
  };
};
