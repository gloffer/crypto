import MockAdapter from 'axios-mock-adapter';
import { mockAuth } from '../../app/modules/auth';
export default function mockAxios(axios) {
    const mock = new MockAdapter(axios, { delayResponse: 300 });
    mockAuth(mock);
    return mock;
}
