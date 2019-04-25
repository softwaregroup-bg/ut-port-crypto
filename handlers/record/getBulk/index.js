exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/bulk/',
        httpMethod: 'POST',
        payload: msg
    };
};
