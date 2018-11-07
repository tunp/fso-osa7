const totalLikes = (blogs) => {
    const reducer = (acc, cur) => acc + cur;
    return blogs && blogs.length ? blogs.map(blog => blog.likes).reduce(reducer) : 0;
}

const favoriteBlog = (blogs) => {
    if (blogs && blogs.length) {
        return blogs.reduce((acc, cur) => !cur || acc.likes > cur.likes ? acc : cur);
    }
    return undefined;
}

const mostBlogs = (blogs) => {
    let most;
    if (blogs && blogs.length) {
        const most_hash = {};
        blogs.forEach((blog) => {
            if (!most_hash[blog.author]) {
                most_hash[blog.author] = 0;
            }
            most_hash[blog.author]++;
        });
        for (let author in most_hash) {
            if (!most || most.blogs < most_hash[author]) {
                most = { author, blogs: most_hash[author] };
            }
        }
    }
    return most;
}

const mostLikes = (blogs) => {
    let most;
    if (blogs && blogs.length) {
        const most_hash = {};
        blogs.forEach((blog) => {
            if (!most_hash[blog.author]) {
                most_hash[blog.author] = 0;
            }
            most_hash[blog.author] += blog.likes;
        });
        for (let author in most_hash) {
            if (!most || most.likes < most_hash[author]) {
                most = { author, likes: most_hash[author] };
            }
        }
    }
    return most;
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
