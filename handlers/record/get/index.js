exports.request = function(msg, $meta) {
    return {
        uri: `/api/record/${msg.id}/`,
        httpMethod: 'GET'
    };
};
