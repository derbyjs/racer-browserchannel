var Duplex = require('stream').Duplex;
var browserChannel = require('browserchannel').server;
var through = require('through');
var path = require('path');
var util = require('util');

// Pass in pass through stream
module.exports = function(backend, serverOptions, clientOptions) {
  if (!clientOptions) clientOptions = {};
  if (clientOptions.reconnect == null) clientOptions.reconnect = true;
  var clientOptionsJson = JSON.stringify(clientOptions);

  // Add the client side script to the Browserify bundle. Set the clientOptions
  // needed to connect to the corresponding server by injecting them into the
  // file during bundling
  backend.on('bundle', function(bundle) {
    var browserFilename = path.join(__dirname, 'browser.js');
    bundle.transform(function(filename) {
      if (filename !== browserFilename) return through();
      var file = '';
      return through(
        function write(data) {
          file += data;
        }
      , function end() {
          var rendered = file.replace('{{clientOptions}}', clientOptionsJson);
          this.queue(rendered);
          this.queue(null);
        }
      );
    });
    bundle.add(browserFilename);
  });

  var middleware = browserChannel(serverOptions, function(client, connectRequest) {
    var stream = createStream(client);
    backend.listen(stream, connectRequest);
  });
  return middleware;
};

/**
 * @param {EventEmitters} client is a browserchannel client session for a given
 * browser window/tab that is has a connection
 * @return {Duplex} stream
 */
function createStream(client) {
  var stream = new ClientStream(client);

  client.on('message', function onMessage(message) {
    var data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      stream.emit('error', err);
      return;
    }
    stream.push(data);
  });

  client.on('close', function() {
    // Signal data writing is complete. Emits the 'end' event
    stream.push(null);
  });

  return stream;
}


function ClientStream(client) {
  Duplex.call(this, {objectMode: true});

  this.client = client;

  var self = this;

  this.on('error', function(error) {
    console.warn('BrowserChannel client message stream error', error.stack || error);
    self._stopClient();
  });

  // The server ended the writable stream. Triggered by calling stream.end()
  // in agent.close()
  this.on('finish', function() {
    self._stopClient();
  });
}
util.inherits(ClientStream, Duplex);

ClientStream.prototype._read = function() {};

ClientStream.prototype._write = function(chunk, encoding, callback) {
  // Silently drop messages after the session is closed
  if (this.client.state === 'closed') return;
  this.client.send(chunk);
  callback();
};

ClientStream.prototype._stopClient = function() {
  var client = this.client;
  client.stop(function() {
    client.close();
  });
};
