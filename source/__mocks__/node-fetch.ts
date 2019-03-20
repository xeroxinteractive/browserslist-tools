const { FetchError } = require.requireActual('node-fetch');

import { response } from './browsers.json';

const fetch = jest.fn(async () => ({
  json: async () => {
    return response;
  },
  ok: true
}));

export { FetchError };

export default fetch;
