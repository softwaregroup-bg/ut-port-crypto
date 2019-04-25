exports.request = function(msg, $meta) {
    return {
        uri: `/api/configuration/index/${msg.documentType}/`,
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
