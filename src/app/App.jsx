import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    LayoutProvider,
    LayoutSplashScreen,
} from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import { Routes } from './routing/Routes'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'

const App = ({ basename }) => (
    <Suspense fallback={<LayoutSplashScreen />}>
        <BrowserRouter basename={basename}>
            <I18nProvider>
                <LayoutProvider>
                    <AuthInit>
                        <Routes />
                    </AuthInit>
                </LayoutProvider>
            </I18nProvider>
        </BrowserRouter>
    </Suspense>
)

App.propTypes =  {
    basename: PropTypes.string.isRequired,
}

export default App
