exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/index/',
        httpMethod: 'POST',
        payload: msg
    };
};
