/* eslint-disable require-jsdoc */
import { response } from './browsers.json';

export default async function fetch(): Promise<{ json: () => Promise<{}> }> {
  return {
    json: async () => {
      return response;
    }
  };
}
