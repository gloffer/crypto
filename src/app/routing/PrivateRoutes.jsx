import React, { Suspense } from 'react'
import {
    Redirect, Route, Switch,
} from 'react-router-dom'
import { FallbackView } from '../../_metronic/partials'
import Trades from '../views/Trades'
import Correlation from '../views/Correlation'
import CoinAnalysis from '../views/CoinAnalysis'
import { Test } from '../components/Test'

export function PrivateRoutes() {
    return (<Suspense fallback={<FallbackView />}>
        <Switch>
            <Route path='/trades' component={Trades} />
            <Route path='/correlation' component={Correlation} />
            <Route path='/coin-analysis' component={CoinAnalysis} />
            <Route path='/test' component={Test} />
            <Redirect from='/auth' to='/trades' />
            <Redirect exact from='/' to='/trades' />
            <Redirect to='error/404' />
        </Switch>
    </Suspense>)
}
