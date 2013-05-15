var racer = require('racer');
var BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

racer.Model.prototype._createSocket = function(bundle) {
  return new BCSocket('/channel', bundle.racerBrowserChannel);
};
