const { FetchError } = jest.requireActual('node-fetch');

import mockBrowserReport from '../__specs__/browser-report';

const fetch = jest.fn(
  async (): Promise<Record<string, any>> => ({
    json: async (): Promise<Record<string, any>> => {
      return mockBrowserReport;
    },
    ok: true,
  })
);

export { FetchError };

export default fetch;
