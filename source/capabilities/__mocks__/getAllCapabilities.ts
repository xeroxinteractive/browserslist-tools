import {Capability} from '../../types';
import {response} from './browsers.json';

export default async function getAllCapabilities(username: string = process.env.BROWSER_STACK_USERNAME, accessKey: string = process.env.BROWSER_STACK_ACCESS_KEY): Promise<Capability[]> {
    return response;
}