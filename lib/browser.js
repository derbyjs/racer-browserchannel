var racer = require('racer');
var BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

racer.Model.prototype._createSocket = function() {
  // TODO: Support configuration options
  var options = this._get(['$racerBrowserChannel']);
  return new BCSocket('/channel', options);
};
