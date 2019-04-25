exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/remove/',
        httpMethod: 'DELETE',
        payload: msg
    };
};
