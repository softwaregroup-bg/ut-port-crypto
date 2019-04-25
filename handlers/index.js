const entities = {
    index: require('./index/index'),
    constraint: require('./constraint'),
    record: require('./record'),
    health: require('./health')
};
const conversions = {
    'request': 'send',
    'response': 'receive',
    'error': 'receive'
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

for (let entity in entities) {
    let actions = entities[entity];
    for (let action in actions) {
        let hooks = actions[action];
        let defaultHooks = defaultHooksFactory(entity, action);
        for (let hook in defaultHooks) {
            handlers[`${entity}.${action}.${hook}.${conversions[hook]}`] = hooks[hook] || defaultHooks[hook];
        }
    };
};

module.exports = handlers;
