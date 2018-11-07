export const msgShowing = (msg, msg_type) => {
    return async (dispatch) => {
        dispatch({ type: 'CHANGE_MSG', msg, msg_type })
        setTimeout(() => {
            dispatch({ type: 'CHANGE_MSG', msg: undefined, msg_type: undefined })
        }, 2000)
    }
}

const reducer = (state = { msg: undefined, msg_type: undefined }, action) => {
    switch (action.type) {
        case 'CHANGE_MSG': return { msg: action.msg, msg_type: action.msg_type }
        default: return state
    }
}

export default reducer
