const axios = require('axios')


module.exports = {
    getApi:(url,params) => {
        return axios.get(url,params)
    },
    postApi:() => {
        return axios.post(arguments)
    },
    axiosApi:() => {
        return axios(arguments)
    }
}