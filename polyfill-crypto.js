// Polyfill node:crypto for Node.js v16 so Vite 5 can build
const crypto = require('crypto');
const { webcrypto } = crypto;
if (webcrypto) {
    if (!crypto.getRandomValues) {
        Object.defineProperty(crypto, 'getRandomValues', {
            value: function(array) {
                return webcrypto.getRandomValues(array);
            },
            writable: true,
            configurable: true
        });
    }
    if (!globalThis.crypto) {
        globalThis.crypto = webcrypto;
    }
    if (globalThis.crypto && !globalThis.crypto.getRandomValues) {
        globalThis.crypto.getRandomValues = (array) => {
            return webcrypto.getRandomValues(array);
        };
    }
}
