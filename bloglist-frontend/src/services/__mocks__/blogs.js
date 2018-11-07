let token = null

let blogs = [
    {
        _id: 1,
        title: 'test title 1',
        author: 'test author 1',
        url: 'https://author.test/1',
        likes: 1,
        user: { _id: 101, name: 'Test User 1' }
    },
    {
        _id: 2,
        title: 'test title 2',
        author: 'test author 2',
        url: 'https://author.test/2',
        likes: 2,
        user: { _id: 102, name: 'Test User 2' }
    }
]

const getAll = () => {
    return Promise.resolve(blogs)
}

const add = (content) => {
    content._id = blogs.length + 1
    content.user = JSON.parse(localStorage.getItem('blogsLoggedUser'))
    // dont concat now as we want to reset the state
    //blogs = blogs.concat(content)
    return Promise.resolve(content)
}

const setToken = (new_token) => {
    token = `bearer ${new_token}`
}

export default { getAll, blogs, setToken, add }
