import React from 'react'
import { shallow } from 'enzyme'
import Togglable from './Togglable'

describe.only('<Togglable />', () => {
    let on_click_handler
    let togglable_component
    beforeEach(() => {
        on_click_handler = jest.fn()
        togglable_component = shallow(<Togglable toggle_vis_cb={on_click_handler} button_label={"Click"} />)
    })
    it('toggle', () => {
        const button = togglable_component.find('Button.show_button')
        const count = 2
        for (let i = 0; i < count; i++) {
            button.simulate('click')
        }
        expect(on_click_handler.mock.calls.length).toBe(count)
    })
    it('content not shown', () => {
        const drop = togglable_component.find('.content_drop')
        expect(drop.getElement().props.style).toEqual({ display: 'none' })
    })
    it('content shown', () => {
        const vis_button = togglable_component.find('Button.show_button')
        vis_button.simulate('click')
        const drop = togglable_component.find('.content_drop')
        expect(drop.getElement().props.style).toEqual({ display: '' })
    })
})
