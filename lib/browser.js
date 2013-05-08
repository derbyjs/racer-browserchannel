var racer = require('racer');
var BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

racer.Model.prototype._createSocket = function() {
  return new BCSocket('/channel', {reconnect: true});
};
