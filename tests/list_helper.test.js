const listHelper = require("../utils/list_helper");

const empty_blogs = []
const one_blog = [{ title: "Jallublogi", author: "Test Author", url: "http://jallublogi.tumblr.com", likes: 3 }];
const multi_blogs = [
    ...one_blog,
    { title: "The npm Blog" , author: "Test Author", url: "https://blog.npmjs.org/", likes: 4 },
    { title: "Official Jolla Blog", author: "Test Author", url: "https://blog.jolla.com/", likes: 5 },
    { title: "Raspberry Pi Blog", author: "Test Author 2", url: "https://www.raspberrypi.org/blog/", likes: 6 },
    { title: "OpenStreetMap Blog", author: "Test Author 2", url: "https://blog.openstreetmap.org/", likes: 7 }
]

describe('totalLikes', () => {
    test('empty blog likes', () => {
        const res = listHelper.totalLikes(empty_blogs)
        expect(res).toBe(0)
    })
    test('one blog likes', () => {
        const res = listHelper.totalLikes(one_blog)
        expect(res).toBe(3)
    })
    test('multiple blog likes', () => {
        const res = listHelper.totalLikes(multi_blogs)
        expect(res).toBe(25)
    })
})

describe('favoriteBlog', () => {
    test('empty blog favorite', () => {
        const res = listHelper.favoriteBlog(empty_blogs)
        expect(res).toEqual(undefined)
    })
    test('one blog favorite', () => {
        const res = listHelper.favoriteBlog(one_blog)
        expect(res).toEqual(one_blog[0])
    })
    test('multiple blog favorite', () => {
        const res = listHelper.favoriteBlog(multi_blogs)
        expect(res).toEqual(multi_blogs[4])
    })
})

describe('mostBlogs', () => {
    test('empty blog most', () => {
        const res = listHelper.mostBlogs(empty_blogs)
        expect(res).toEqual(undefined)
    })
    test('one blog most', () => {
        const res = listHelper.mostBlogs(one_blog)
        expect(res).toEqual({ author: "Test Author", blogs: 1 })
    })
    test('multi blogs most', () => {
        const res = listHelper.mostBlogs(multi_blogs)
        expect(res).toEqual({ author: "Test Author", blogs: 3 })
    })
})

describe('mostLikes', () => {
    test('empty blog most likes', () => {
        const res = listHelper.mostLikes(empty_blogs)
        expect(res).toEqual(undefined)
    })
    test('one blog most likes', () => {
        const res = listHelper.mostLikes(one_blog)
        expect(res).toEqual({ author: "Test Author", likes: 3 })
    })
    test('multi blogs most likes', () => {
        const res = listHelper.mostLikes(multi_blogs)
        expect(res).toEqual({ author: "Test Author 2", likes: 13 })
    })
})
