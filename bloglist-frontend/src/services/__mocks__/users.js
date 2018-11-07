const users = [
    {
        _id: 101,
        username: 'testun1',
        name: 'Test User 1',
        adult: 0,
        blogs: [{ _id: 1, title: 'test title 1' }]
    },
    {
        _id: 102,
        username: 'testun2',
        name: 'Test User 2',
        adult: 0,
        blogs: [{ _id: 2, title: 'test title 2' }]
    }
]

const getAll = () => {
    return Promise.resolve(users)
}

export default { getAll, users }
