import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { getUserByToken } from './AuthCRUD';
export const actionTypes = {
    Login: '[Login] Action',
    Logout: '[Logout] Action',
    Register: '[Register] Action',
    UserRequested: '[Request User] Action',
    UserLoaded: '[Load User] Auth API',
    SetUser: '[Set User] Action',
};
const initialAuthState = {
    user: undefined,
    accessToken: undefined,
};
export const reducer = persistReducer({ storage, key: 'v100-demo2-auth', whitelist: ['user', 'accessToken'] }, (state = initialAuthState, action) => {
    switch (action.type) {
        case actionTypes.Login: {
            const accessToken = action.payload?.accessToken;
            return { accessToken, user: undefined };
        }
        case actionTypes.Register: {
            const accessToken = action.payload?.accessToken;
            return { accessToken, user: undefined };
        }
        case actionTypes.Logout: {
            return initialAuthState;
        }
        case actionTypes.UserRequested: {
            return { ...state, user: undefined };
        }
        case actionTypes.UserLoaded: {
            const user = action.payload?.user;
            return { ...state, user };
        }
        case actionTypes.SetUser: {
            const user = action.payload?.user;
            return { ...state, user };
        }
        default:
            return state;
    }
});
export const actions = {
    login: (accessToken) => ({ type: actionTypes.Login, payload: { accessToken } }),
    register: (accessToken) => ({
        type: actionTypes.Register,
        payload: { accessToken },
    }),
    logout: () => ({ type: actionTypes.Logout }),
    requestUser: () => ({
        type: actionTypes.UserRequested,
    }),
    fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
    setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
};
export function* saga() {
    yield takeLatest(actionTypes.Login, function* loginSaga() {
        yield put(actions.requestUser());
    });
    yield takeLatest(actionTypes.Register, function* registerSaga() {
        yield put(actions.requestUser());
    });
    yield takeLatest(actionTypes.UserRequested, function* userRequested() {
        const { data: user } = yield getUserByToken();
        yield put(actions.fulfillUser(user));
    });
}
