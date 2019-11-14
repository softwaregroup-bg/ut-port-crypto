exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/constraint/',
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
