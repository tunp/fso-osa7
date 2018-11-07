import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const add = (new_blog) => {
    const config = {
        headers: { Authorization: token }
    }
    const request = axios.post(baseUrl, new_blog, config)
    return request.then(response => response.data)
}

const update = (id, blog) => {
    const config = {
        headers: { Authorization: token }
    }
    const request = axios.put(`${baseUrl}/${id}`, blog, config)
    return request.then(response => response.data)
}

const remove = (id) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.delete(`${baseUrl}/${id}`, config)
}

const setToken = (new_token) => {
    token = `bearer ${new_token}`
}

export default { getAll, add, update, remove, setToken }
