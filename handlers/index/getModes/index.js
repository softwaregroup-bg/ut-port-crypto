exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/modes/',
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
