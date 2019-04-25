const isEqual = require('lodash.isequal');
module.exports = port => {
    let {config, bus} = port;
    const autoSync = Object.assign({
        interval: 3000,
        retries: 5
    }, config.autoSync);
    let counter = 0;
    const checkHealth = () => {
        return bus.importMethod('crypto.health.check')({})
            .catch((err) => {
                if (++counter < autoSync.retries) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(checkHealth());
                        }, autoSync.interval);
                    });
                }
                throw err;
            });
    };
    return checkHealth()
        .then(() => {
            const models = config.models || {};
            return Promise.all(Object.keys(models).map(documentType => {
                const config = models[documentType].crypto || {};
                return Promise.all(['index', 'constraint'].map(entity => {
                    const items = config[entity] || [];
                    return bus.importMethod(`crypto.${entity}.get`)({
                        documentType,
                        allowedStatusCodes: 404
                    })
                        .then(result => {
                            if (!result.items) {
                                return bus.importMethod(`crypto.${entity}.add`)({
                                    documentType,
                                    items
                                })
                                    .then(() => 'added');
                            }
                            if (!isEqual(items, result.items)) {
                                return bus.importMethod(`crypto.${entity}.update`)({
                                    documentType,
                                    items
                                })
                                    .then(() => 'updated');
                            }
                            return 'up to date';
                        })
                        .then((status) => ({documentType, entity, status}));
                }));
            }))
                .then(result => {
                    if (port.log.info) {
                        port.log.info(
                            {
                                $meta: {
                                    mtid: 'event',
                                    opcode: 'crypto.sync'
                                },
                                summary: result.reduce((all, obj) => all.concat(obj), [])
                            }
                        );
                    }
                    return true;
                });
        });
};
