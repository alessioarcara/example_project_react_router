import { useReducer, useCallback } from "react";

const httpReducer = (state, action) => {
    if (action.type === "SEND") {
        return {data: null, status: 'pending', error: null}
    }
    if (action.type === "SUCCESS") {
        return {data: action.responseData, status: 'completed', error: null}
    }
    if (action.type === "ERROR") {
        return {data: null, status: 'completed', error: action.error}
    }
    return state;
}

const useHttp = (startWithPending = false) => {
    const [httpState, dispatch] = useReducer(httpReducer,
        { status: startWithPending ? 'pending' : null, data: null, error: null} )

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        dispatch({type: "SEND"})
        try {
            const res = await fetch(requestConfig.url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestConfig.body)
            })
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Request failed!');
            }

            const resData = await res.json();
            dispatch({type: 'SUCCESS', responseData: applyData(resData)});
        } catch (err) {
            dispatch({type: "ERROR", error: err.message || 'Something went wrong!'})
        }
    }, []);

    return {
        sendRequest,
        ...httpState
    }
}

export default useHttp;
