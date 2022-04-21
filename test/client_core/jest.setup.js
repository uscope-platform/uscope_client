import { server } from './mock/server'
import {set_address, set_redis_store} from "../../src/client_core";
import {mock_store} from "./mock/redux_store";

// Establish API mocking before all tests.
beforeAll(() => {
    server.listen()
})

beforeEach(() =>{
    set_address("test_server/");
    set_redis_store(mock_store);
    mock_store.dispatch({type: 'RESET_STORE'});
})
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())