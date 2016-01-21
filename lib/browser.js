var racer = require('racer');
var BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

var CLIENT_OPTIONS = {{clientOptions}};

racer.Model.prototype._createSocket = function(bundle) {
  var options = CLIENT_OPTIONS;
  if (bundle.browserChannel) {
    options = racer.util.mergeInto({}, options);
    racer.util.mergeInto(options, bundle.browserChannel);
  }
  var base = options.base || '/channel';
  return new BCSocket(base, options);
};
