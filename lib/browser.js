const racer = require('racer');
const BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

const DEFAULT_CLIENT_OPTIONS = {
  reconnect: true,
  base: '/channel',
}

module.exports = function init(clientOptions) {
  if (!process.browser) {
    return;
  }
  const options = Object.assign({}, DEFAULT_CLIENT_OPTIONS, clientOptions);

  racer.Model.prototype._createSocket = function(bundle) {
    if (bundle.browserChannel) {
      racer.util.mergeInto(options, bundle.browserChannel);
    }
    return new BCSocket(options.base, options);
  };
}
