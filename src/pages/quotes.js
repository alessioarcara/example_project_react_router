import React, {useEffect} from "react";
import QuoteList from "../components/quotes/QuoteList";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NoQuotesFound from "../components/quotes/NoQuotesFound";

const requestBody = {
    query: `
          query {
            quotes {
              _id
              author
              text
            }
          }
        `
};

const Quotes = () => {
    const {status, error, sendRequest: fetchQuotes, data: quotes} = useHttp(true)

    useEffect(() => {
        const transformQuotes = resData => {
            const loadedQuotes = resData.data.quotes
            return loadedQuotes.map(quote => {
                return {...quote, id: quote._id}
            })
        }
        fetchQuotes({url: "http://localhost:3001/api", body: requestBody}, transformQuotes)
    }, [fetchQuotes])

    if (status === 'pending'){
        return (
            <div className='centered'>
                <LoadingSpinner/>
            </div>
        )
    }
    if (error) {
        return <p className='centered focused'>{error}</p>
    }
    if (status === 'completed' && (!quotes || quotes.length === 0)) {
        return <NoQuotesFound/>
    }

    return (
        <QuoteList quotes={quotes}/>
    )
}

export default Quotes;
