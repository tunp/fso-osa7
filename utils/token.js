
const getTokenFrom = (request, response, next) => {
    const auth = request.get('Authorization')
    const schema = "bearer"
    if (auth && auth.toLowerCase().startsWith(schema + " ")) {
        request.token = auth.substr(schema.length + 1)
    }
    next()
}

module.exports = { getTokenFrom }
