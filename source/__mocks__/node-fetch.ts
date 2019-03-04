import {response} from './browsers.json';

export default async function fetch(url: string): Promise<{json: () => Promise<{}>}> {
    return {
        json: async() => {
            return response;
        }
    };
}