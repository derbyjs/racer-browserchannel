var bcPath = require.resolve('browserchannel/dist/bcsocket-uncompressed');

module.exports = plugin;

function plugin(racer) {
  racer.Store.prototype.socketMiddleware = socketMiddleware;

  racer.on('bundle', function(browserify) {
    browserify.require(bcPath, {expose: 'bcsocket'});
  });
}

function socketMiddleware() {
  var store = this;
  var middleware = browserChannel({server: this.server}, function(client) {
    var stream = createBrowserChannelStream(client);
    store.shareClient.listen(stream);
  });
  return middleware;
}
