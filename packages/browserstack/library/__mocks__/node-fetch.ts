const { FetchError } = jest.requireActual('node-fetch');

import { response } from '../__specs__/browsers.json';

const fetch = jest.fn(
  async (): Promise<Record<string, any>> => ({
    json: async (): Promise<Record<string, any>> => {
      return response;
    },
    ok: true,
  })
);

export { FetchError };

export default fetch;
