import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom'
import QuoteForm from "../components/quotes/QuoteForm";
import useHttp from "../hooks/use-http";

const requestBody = (quoteData) => {
    return {
        query: `
          mutation($quoteData: QuoteInput!) {
            createQuote(inputQuote: $quoteData)
          }
        `,
        variables: {quoteData}
    }
};

const NewQuote = () => {
    const {status, sendRequest: createQuote} = useHttp()
    const history = useHistory()

    useEffect(() => {
        if (status === 'completed') {
            history.push('/quotes')
        }
    }, [status, history])

    const addQuoteHandler = quoteData => {
        createQuote({url: "http://localhost:3001/api", body: requestBody(quoteData)})
    };

    return (
        <QuoteForm isLoading={status === 'pending'} onAddQuote={addQuoteHandler}/>
    )
};


export default NewQuote
