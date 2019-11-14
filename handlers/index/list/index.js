exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/',
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
