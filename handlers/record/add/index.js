exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/',
        httpMethod: 'POST',
        payload: msg
    };
};
