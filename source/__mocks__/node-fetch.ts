const { FetchError } = require.requireActual('node-fetch');

import { response } from './browsers.json';

const fetch = jest.fn(
  async (): Promise<object> => ({
    json: async (): Promise<object> => {
      return response;
    },
    ok: true
  })
);

export { FetchError };

export default fetch;
