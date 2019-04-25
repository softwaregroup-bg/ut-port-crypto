exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/',
        httpMethod: 'PUT',
        payload: msg
    };
};
