exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/bulkPartialUpdate/',
        httpMethod: 'PATCH',
        payload: msg,
        allowedStatusCodes: msg.allowedStatusCodes
    };
};
