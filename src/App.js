import React, {Suspense} from "react";
import {Route, Switch, Redirect} from 'react-router-dom'

import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const NewQuote = React.lazy(() => import("./pages/new-quote"))
const QuoteDetail = React.lazy(() => import("./pages/quote-detail"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const Quotes = React.lazy(() => import("./pages/quotes"))

function App() {
    return (
        <Layout>
            <Suspense fallback={
                <div className='centered'>
                    <LoadingSpinner/>
                </div>
            }>
                <Switch>
                    <Route path="/" exact>
                        <Redirect to='/quotes'/>
                    </Route>
                    <Route path="/quotes" exact>
                        <Quotes/>
                    </Route>
                    <Route path="/quotes/:quoteId">
                        <QuoteDetail/>
                    </Route>
                    <Route path="/new-quote">
                        <NewQuote/>
                    </Route>
                    <Route path='*'>
                        <NotFound/>
                    </Route>
                </Switch>
            </Suspense>
        </Layout>
    );
}

export default App;
