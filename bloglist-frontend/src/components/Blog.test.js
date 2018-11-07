import React from 'react'
import { shallow } from 'enzyme'
import { Blog } from './Blog'

describe.only('<Blog />', () => {
    let blog
    let on_click_handler
    let blog_component
    beforeEach(() => {
        blog = {
            _id: 2342,
            title: "test title 1",
            author: "test author 2",
            likes: 3,
            user: { name: "test user 4" },
            comments: []
        }
        const blogUpdating = (id, new_blog) => {
            blog.likes = new_blog.likes
        }
        blog_component = shallow(
            <Blog id={blog._id} blogs={[blog]} user={{id:46}}
                blogUpdating={blogUpdating}
                blogRemoving={() => {}}
                msgShowing={() => {}}
            />)
    })
    it('renders blog', () => {
        const title_author = blog_component.find('.title_author')
        const likes = blog_component.find('.likes')
        expect(title_author.text()).toContain(`${blog.title} ${blog.author}`)
        expect(likes.text()).toContain(`${blog.likes} likes`)
    })
    it('liking blog', () => {
        const orig_blog_likes = blog.likes
        const button = blog_component.find('Button.liking')
        const count = 2
        for (let i = 0; i < count; i++) {
            button.simulate('click')
        }
        expect(blog.likes).toBe(orig_blog_likes+count)
    })
})
