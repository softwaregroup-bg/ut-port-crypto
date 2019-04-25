exports.request = function(msg, $meta) {
    return {
        uri: '/api/record/fetch/constraint/',
        httpMethod: 'POST',
        payload: msg
    };
};
