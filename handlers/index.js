const entities = {
    index: require('./index/index'),
    constraint: require('./constraint'),
    record: require('./record'),
    health: require('./health')
};
const conversions = {
    request: 'send',
    response: 'receive',
    error: 'receive'
};

const defaultHooksFactory = (entity, action) => {
    return {
        request: function(msg, $meta) {
            return msg;
        },
        response: function(msg, $meta) {
            return msg.payload || {};
        },
        error: function(cause, $meta) {
            const errorType = cause.statusCode === 404 ? `crypto.${entity}.notFound` : `crypto.${entity}`;
            const errorFactory = this.errors[errorType] || this.errors.crypto;
            throw errorFactory({
                action,
                cause,
                details: {
                    statusCode: cause.statusCode
                }
            });
        }
    };
};

const handlers = {};

for (const entity in entities) {
    const actions = entities[entity];
    for (const action in actions) {
        const hooks = actions[action];
        const defaultHooks = defaultHooksFactory(entity, action);
        for (const hook in defaultHooks) {
            handlers[`${entity}.${action}.${hook}.${conversions[hook]}`] = hooks[hook] || defaultHooks[hook];
        }
    };
};

module.exports = handlers;
