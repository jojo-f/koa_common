var Readable = require('stream').Readable;
var inherits = require('util').inherits;

exports.subscribe = function (event, options) {
    return Subscription(options);
};

inherits(Subscription, Readable);

function Subscription(options) {
    if (!(this instanceof Subscription)) return new Subscription(options);

    options = options || {};
    Readable.call(this, options);

    this.isInit = false;
    this.value = 0
}

Subscription.prototype._read = function () {
    if (!this.isInit) {
        this.push(String(1))
        this.isInit = true
    }
};