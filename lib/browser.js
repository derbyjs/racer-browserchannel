var BCSocket = require('bcsocket').BCSocket;

module.exports = plugin;

function plugin(racer) {
  racer.Model.prototype._createSocket = createSocket;
}

// Create the browserside socket endpoint
function createSocket() {
  return new BCSocket('/channel', {reconnect: true});
};
