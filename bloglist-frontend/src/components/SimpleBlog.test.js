import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', () => {
    it('renders simple blog', () => {
        const blog = {
            title: "test title 1",
            author: "test author 2",
            likes: 3
        }
        const simple_blog_component = shallow(<SimpleBlog blog={blog} onClick={undefined} />)
        const title_author = simple_blog_component.find('.title_author')
        const likes = simple_blog_component.find('.likes')
        expect(title_author.text()).toContain(`${blog.title} ${blog.author}`)
        expect(likes.text()).toContain(`blog has ${blog.likes} likes`)
    })
    it('liking simple blog', () => {
        const blog = {
            title: "test title 1",
            author: "test author 2",
            likes: 3
        }
        const on_click_handler = jest.fn()
        const simple_blog_component = shallow(<SimpleBlog blog={blog} onClick={on_click_handler} />)
        const button = simple_blog_component.find('button')
        const count = 2
        for (let i = 0; i < count; i++) {
            button.simulate('click')
        }
        expect(on_click_handler.mock.calls.length).toBe(count)
    })
})
