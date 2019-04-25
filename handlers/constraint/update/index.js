exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/constraint/',
        httpMethod: 'PUT',
        payload: msg
    };
};
