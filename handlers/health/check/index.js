exports.request = function(msg, $meta) {
    return {
        uri: '/actuator/health/',
        httpMethod: 'GET'
    };
};
