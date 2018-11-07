import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer'
import { MemoryRouter, Route } from 'react-router-dom'
import store from './store'
import App from './App'
jest.mock('./services/blogs')
import blogService from './services/blogs'
jest.mock('./services/users')

import {createSerializer} from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));

describe('<App />', () => {
    let app
    describe('user not logged in', () => {
        beforeAll(() => {
            app = mount(
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <Route path="/" component={App} />
                    </MemoryRouter>
                </Provider>
            )
        })

        it('doesnt show any blogs', () => {
            app.update()
            expect(app.find('input[name="username"]').length).toBe(1)
            expect(app.find('input[name="password"]').length).toBe(1)
            expect(app.find('.blog_list_link').length).toBe(0)
        })
    })
    describe('user logged in', () => {
        beforeAll(async () => {
            const user = {
                _id: 101,
                username: 'testun1',
                token: '21433543',
                name: 'Test User 1'
            }
            localStorage.setItem('blogsLoggedUser', JSON.stringify(user))
            app = await mount(
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <Route path="/" component={App} />
                    </MemoryRouter>
                </Provider>
            )
        })

        it('shows blogs', () => {
            app.update()
            expect(app.find('input[name="username"]').length).toBe(0)
            expect(app.find('input[name="password"]').length).toBe(0)
            expect(app.find('Link.blog_list_link').length).toBe(blogService.blogs.length)
        })

        it('adds blog', async () => {
            app.update()
            const show_button = app.find('.add_blog_togglable Button.show_button')
            show_button.simulate('click')
            app.update()
            const title = app.find('input[name="title"]')
            const author = app.find('input[name="author"]')
            const url =  app.find('input[name="url"]')
            title.at(0).instance().value = "test title 3";
            title.simulate('change')
            author.at(0).instance().value = "test author 3";
            author.simulate('change')
            url.at(0).instance().value = "test url 3";
            url.simulate('change')
            // simulate click doestnt wait for the await so using addBlog directly
            //app.find('BlogForm Form').simulate('submit')
            await app.find('BlogForm').at(0).instance().addBlog({ preventDefault: ()=>{}})
            app.update()
            expect(app.find('Link.blog_list_link').length).toBe(blogService.blogs.length+1)
            // simulate click doesn't seem to work wor some reason so using history.push
            //app.find('NavLink.users_link a').simulate('click'))
            app.find('.default_route').at(0).instance().context.router.history.push('/users')
            app.update()
            var user_blogs_count = app.find('.user_blogs_count');
            let total_count = 0;
            for (let i = 0; i < user_blogs_count.length; i++) {
                total_count += user_blogs_count.at(i).instance().textContent*1
            }
            expect(total_count).toBe(blogService.blogs.length+1)
        })
    })

    describe('rendering', () => {
        let app2
        beforeAll(async () => {
            const user = {
                _id: 101,
                username: 'testun1',
                token: '21433543',
                name: 'Test User 1'
            }
            localStorage.setItem('blogsLoggedUser', JSON.stringify(user))
            app2 = await mount(
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <Route path="/" component={App} />
                    </MemoryRouter>
                </Provider>
            )
        })

        it('renders correctly', async () => {
            app2.update()
            expect(app2).toMatchSnapshot()
        })
    })
})
