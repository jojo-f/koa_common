const streamList = []
const streamSet = new WeakSet()
module.exports = {
    push(message) {
        streamList.forEach(st => st.push(message))
    },
    stub(stream) {
        if (streamSet.has(stream)) return
        streamList.push(stream)
    }
}