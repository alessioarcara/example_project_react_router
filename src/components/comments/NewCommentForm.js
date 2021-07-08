import {useEffect, useRef} from 'react';

import useHttp from "../../hooks/use-http";
import classes from './NewCommentForm.module.css';
import LoadingSpinner from "../UI/LoadingSpinner";

const requestBody = (commentData) => {
    return {
        query: `
          mutation($commentData: CommentInput!) {
            createComment(inputComment: $commentData)
          }
        `,
        variables: {commentData}
    }
};

const NewCommentForm = (props) => {
    const commentTextRef = useRef();

    const {status, error, sendRequest: createComment} = useHttp()

    const { onAddComment } = props;
    useEffect(() => {
        if (status === 'completed' && !error) {
            onAddComment();
        }
    }, [status, error, onAddComment])

    const submitFormHandler = (event) => {
        event.preventDefault();

        const enteredText = commentTextRef.current.value;

        // optional: Could validate here

        createComment({
            url:"http://localhost:3001/api",
            body: requestBody({quote_id: props.quoteId, text: enteredText})
        }, resdata => resdata)
    };

    return (
        <form className={classes.form} onSubmit={submitFormHandler}>
            {status === 'pending' && (<div className='centered'>
                <LoadingSpinner/>
            </div>)}
            <div className={classes.control} onSubmit={submitFormHandler}>
                <label htmlFor='comment'>Your Comment</label>
                <textarea id='comment' rows='5' ref={commentTextRef}></textarea>
            </div>
            <div className={classes.actions}>
                <button className='btn' type="submit">Add Comment</button>
            </div>
        </form>
    );
};

export default NewCommentForm;
