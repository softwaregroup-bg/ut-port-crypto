exports.request = function({
    id,
    sync = true,
    allowedStatusCodes
} = {}, $meta) {
    return {
        uri: '/api/record/remove/',
        httpMethod: 'DELETE',
        payload: {id, sync},
        allowedStatusCodes
    };
};
