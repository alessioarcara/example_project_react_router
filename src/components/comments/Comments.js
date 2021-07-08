import {useState, useEffect, useCallback} from 'react';

import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import {useParams} from "react-router-dom";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import CommentsList from "./CommentsList";

const requestBody = (quoteId) => {
    return {
        query: `
          query($quoteId: ID!) {
            quote(id: $quoteId) {
              comments {
                _id
                text
              }
            }
          }
        `,
        variables: {quoteId}
    }
};

const transformComments = resData => {
    return resData.data.quote.comments.map(comment => {
        return {id: comment._id, text: comment.text}
    })
}

const Comments = () => {
    const [isAddingComment, setIsAddingComment] = useState(false);
    const params = useParams();

    const {quoteId} = params

    const {status, sendRequest: fetchComments, data: comments} = useHttp(true)

    useEffect(() => {
        fetchComments({url: "http://localhost:3001/api", body: requestBody(quoteId)}, transformComments)
    }, [quoteId, fetchComments])

    const startAddCommentHandler = () => {
        setIsAddingComment(true);
    };

    const addCommentHandler = useCallback(() => {
            fetchComments({url: "http://localhost:3001/api", body: requestBody(quoteId)}, transformComments)
        }
        , [fetchComments, quoteId])

    let content;

    if (status === 'pending') {
        content = <div className='centered'>
            <LoadingSpinner/>
        </div>
    }
    if (status === 'completed' && comments && comments.length > 0) {
        content = <CommentsList comments={comments}/>
    }
    if (status === 'completed' && (!comments || comments.length === 0)) {
        content = <p className='centered'>No comments are added yet!</p>
    }

    return (
        <section className={classes.comments}>
            <h2>User Comments</h2>
            {!isAddingComment && (
                <button className='btn' onClick={startAddCommentHandler}>
                    Add a Comment
                </button>
            )}
            {isAddingComment && <NewCommentForm quoteId={params.quoteId} onAddComment={addCommentHandler}/>}
            {content}
        </section>
    );
};

export default Comments;
