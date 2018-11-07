import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

class Togglable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    toggleVisibility = () => {
        this.setState({ visible: !this.state.visible })
        if (this.props.toggle_vis_cb) {
            this.props.toggle_vis_cb()
        }
    }

    render() {
        const hide_when_visible = { display: this.state.visible ? 'none' : '' }
        const show_when_visible = { display: this.state.visible ? '' : 'none' }
        return (
            <div>
                <div style={hide_when_visible}>
                    <Button className={"show_button"} onClick={ this.toggleVisibility }>{ this.props.button_label }</Button>
                </div>
                <div className={"content_drop"} style={show_when_visible}>
                    { React.Children.map(this.props.children, child => React.cloneElement(child, { ...child.props, parent: this })) }
                    <Button className={"hide_button"} onClick={ this.toggleVisibility }>Cancel</Button>
                </div>
            </div>
        )
    }
}

Togglable.propTypes = {
    button_label: PropTypes.string.isRequired
}

export default Togglable;
