function to(URL_MAP, BASE_URL) {

    let MAP = {}

    for (let item in URL_MAP) {
        let start = item.indexOf(' ') + 1
        url = item.substring(0, start) + BASE_URL + item.substring(start + 1)
        MAP[url] = URL_MAP[item]
    }

    return MAP
}

module.exports = {
    to
}