import React from 'react'
import ReactDOM from 'react-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import App from './app/App'
import reportWebVitals from './app/reportWebVitals'
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/style.react.scss'
import * as _redux from './setup'
import store, { persistor } from './setup/redux/Store'
import axios from 'axios'
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'

const { PUBLIC_URL } = 'trading-bot'

_redux.setupAxios(axios, store)
ReactDOM.render(
    <MetronicI18nProvider>
        <Provider store={store}>
            {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
            <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
                <App basename={PUBLIC_URL} />
            </PersistGate>
        </Provider>
    </MetronicI18nProvider>,
    document.getElementById('root'),
)


/*
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals()
