const errors = require('./errors');
function isEqual(x, y) {
    if (typeof x !== typeof y) return false;
    if (typeof x === 'object') {
        const xProps = Object.getOwnPropertyNames(x);
        const yProps = Object.getOwnPropertyNames(y);
        if (xProps.length !== yProps.length) return false;
        for (let i = 0; i < xProps.length; i += 1) {
            let prop = xProps[i];
            if (!isEqual(x[prop], y[prop])) return false;
        }
        return true;
    }
    return x === y;
}

module.exports = (params, ...rest) => {
    const {registerErrors, utMethod} = params;
    return class crypto extends require('ut-port-http')(params, ...rest) {
        get defaults() {
            return {
                logLevel: 'trace',
                type: 'crypto',
                namespace: 'crypto',
                imports: ['crypto'],
                url: 'http://127.0.0.1:8099',
                mock: false,
                autoSync: {
                    interval: 3000,
                    retries: 5
                },
                models: {},
                raw: {
                    json: true,
                    jar: true,
                    strictSSL: false,
                    forever: true,
                    agentOptions: {
                        keepAliveMsecs: 30000,
                        maxFreeSockets: 1000
                    }
                },
                parseResponse: false
            };
        }
        async start(...params) {
            const result = await super.start(...params);
            Object.assign(this.errors, registerErrors(errors));
            return result;
        }
        async sync() {
            const {retries, interval} = this.config.autoSync;
            let counter = 0;
            const checkHealth = async() => {
                try {
                    await utMethod(`${this.config.namespace}.health.check`)({});
                } catch (err) {
                    if (++counter < retries) {
                        return new Promise(resolve => setTimeout(() => resolve(checkHealth()), interval));
                    }
                    throw err;
                }
            };

            await checkHealth();

            const result = await Promise.all(Object.entries(this.config.models).map(([documentType, model]) => {
                return Promise.all(['index', 'constraint'].map(async entity => {
                    const configItems = model[entity] || [];
                    const {items} = await utMethod(`${this.config.namespace}.${entity}.get`)({
                        documentType,
                        allowedStatusCodes: 404
                    });
                    let status;
                    if (!items) {
                        await utMethod(`${this.config.namespace}.${entity}.add`)({
                            documentType,
                            items: configItems
                        });
                        status = 'added';
                    } else if (!isEqual(items, configItems)) {
                        await utMethod(`${this.config.namespace}.${entity}.update`)({
                            documentType,
                            items: configItems
                        });
                        status = 'updated';
                    } else {
                        status = 'up to date';
                    }
                    return {documentType, entity, status};
                }));
            }));
            this.log.info && this.log.info({
                $meta: {
                    mtid: 'event',
                    opcode: 'crypto.sync'
                },
                summary: result.reduce((all, arr) => all.concat(arr), [])
            });
        }
        async ready(...params) {
            const result = await super.start(...params);
            if (this.config.autoSync) await this.sync();
            return result;
        }
        handlers() {
            const methods = this.config.mock ? require('./mock')() : require('./handlers');
            return Object.entries(methods).reduce((handlers, [name, method]) => {
                handlers[`${this.config.namespace}.${name}`] = method;
                return handlers;
            }, {});
        }
    };
};
