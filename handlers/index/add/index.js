exports.request = function(msg, $meta) {
    return {
        uri: '/api/configuration/index/',
        httpMethod: 'POST',
        payload: msg
    };
};
