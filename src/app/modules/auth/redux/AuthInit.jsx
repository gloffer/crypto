import { useRef, useEffect, useState } from 'react';
import { shallowEqual, useSelector, connect, useDispatch } from 'react-redux';
import { LayoutSplashScreen } from '../../../../_metronic/layout/core';
import * as auth from './AuthRedux';
import { getUserByToken } from './AuthCRUD';
const mapState = (state) => ({ auth: state.auth });
const connector = connect(mapState, auth.actions);
const AuthInit = (props) => {
    const didRequest = useRef(false);
    const dispatch = useDispatch();
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    const accessToken = useSelector(({ auth }) => auth.accessToken, shallowEqual);
    // We should request user by authToken before rendering the application
    useEffect(() => {
        const requestUser = async () => {
            try {
                if (!didRequest.current) {
                    const { data: user } = await getUserByToken();
                    dispatch(props.fulfillUser(user));
                }
            }
            catch (error) {
                console.error(error);
                if (!didRequest.current) {
                    dispatch(props.logout());
                }
            }
            finally {
                setShowSplashScreen(false);
            }
            return () => (didRequest.current = true);
        };
        if (accessToken) {
            requestUser();
        }
        else {
            dispatch(props.logout());
            setShowSplashScreen(false);
        }
        // eslint-disable-next-line
    }, []);
    return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>;
};
export default connector(AuthInit);
