exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/',
        httpMethod: 'PUT',
        payload: msg,
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
