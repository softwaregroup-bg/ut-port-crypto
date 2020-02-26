exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/bulkRemove/',
        httpMethod: 'DELETE',
        payload: msg,
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
