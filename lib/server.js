var Duplex = require('stream').Duplex;
var browserChannel = require('browserchannel').server;

module.exports = function(store, options) {
  store.socketMiddleware = socketMiddleware;

  if (!options) options = {};
  if (options.reconnect == null) options.reconnect = true;

  store.on('model', function(model) {
    model._setEach(['$racerBrowserChannel'], options)
  });

  store.on('bundle', function(browserify) {
    browserify.add(__dirname + '/browser');
  });
};

function socketMiddleware() {
  var store = this;
  var middleware = browserChannel({server: this.server}, function(client) {
    var stream = createBrowserChannelStream(client);
    store.shareClient.listen(stream);
  });
  return middleware;
}

function createBrowserChannelStream(client) {
  var stream = new Duplex({objectMode: true});

  stream._write = function _write(chunk, encoding, callback) {
    console.log('browser s->c ', chunk);
    client.send(chunk);
    callback();
  };
  // Ignore. You can't control the information, man!
  stream._read = function _read() {};

  client.on('message', function onMessage(data) {
    console.log('browser c->s ', data);
    stream.push(data);
  });

  stream.on('error', function onError() {
    client.stop();
  });

  return stream;
}
