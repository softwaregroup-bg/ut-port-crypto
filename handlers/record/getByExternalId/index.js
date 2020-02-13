exports.request = function(msg, $meta) {
    return {
        uri: `/api/record/externalId/${msg.externalId}/`,
        httpMethod: 'GET',
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
