import React, {useEffect} from "react";
import {Route, useParams, Link, useRouteMatch} from "react-router-dom"
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import Comments from "../components/comments/Comments";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const requestBody = (quoteId) => {
    return {
        query: `
          query($quoteId: ID!) {
            quote(id: $quoteId) {
              _id
              author
              text
            }
          }
        `,
        variables: {quoteId}
    }
};
const QuoteDetail = () => {
    const match = useRouteMatch()
    const params = useParams()

    const { quoteId } = params;
    const {status, error, sendRequest: fetchQuote, data: quote} = useHttp()

    useEffect(() => {
        const transformQuote = resData => {
            return resData.data.quote
        }
        fetchQuote({url: "http://localhost:3001/api", body: requestBody(quoteId)}, transformQuote)
    }, [fetchQuote, quoteId])

    if (status === 'pending') {
        return <div className='centered'>
            <LoadingSpinner/>
        </div>
    }
    if (error) {
        return <p className='centered'>{error}</p>
    }
    if (!quote) {
        return <p>No quote found!</p>
    }

    return (
        <>
            <HighlightedQuote text={quote.text} author={quote.author}/>
            <Route path={match.path} exact>
                <div className='centered'>
                    <Link className='btn--flat' to={`${match.url}/comments`}>Load Comments</Link>
                </div>
            </Route>
            <Route path={`${match.path}/comments`}>
                <Comments/>
            </Route>
        </>
    )
}

export default QuoteDetail
