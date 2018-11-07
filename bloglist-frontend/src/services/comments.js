import axios from 'axios'

const add = (blog_id, new_comment) => {
    const request = axios.post(`/api/blogs/${blog_id}/comments`, new_comment)
    return request.then(response => response.data)
}

export default { add }
