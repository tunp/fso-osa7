import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Message = ({msg, msg_type}) => { return msg ? (<div className={msg_type}>{msg}</div>) : (<div></div>) }

Message.propTypes = {
    msg: PropTypes.string,
    type: PropTypes.string
}

const mapStateToProps = (state) => {
    return {
        msg: state.notifications.msg,
        msg_type: state.notifications.msg_type
    }
}

const ConnectedMessage = connect(mapStateToProps)(Message)

export default ConnectedMessage
