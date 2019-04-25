exports.request = function(msg, $meta) {
    return {
        uri: `/api/configuration/constraint/${msg.documentType}/`,
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
