# racer-browserchannel

Adds [browserchannel](https://github.com/josephg/node-browserchannel) socket support to [Racer](https://github.com/derbyjs/racer) models

## Usage

In server code
```js
const options = {};
const racerBrowserChannel = require('@derbyjs/racer-browserchannel');
const racerBrowserChannel = racerBrowserChannel(backend, options}
express.use(browserchannel);
```

In client (browser) app

```js
const options = {};
const racerBrowserChannel = require('@derbyjs/racer-browserchannel/lib/browser');
racerBrowserChannel(options);
```

For `options` see `[browserchannel API docs](https://github.com/josephg/node-browserchannel#api)
