import {Capability} from '../types';
import fetch from 'node-fetch';

export default async function getAllCapabilities(username: string = process.env.BROWSER_STACK_USERNAME, accessKey: string = process.env.BROWSER_STACK_ACCESS_KEY): Promise<Capability[]> {
    const response = await fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/browsers.json`);
    return await response.json();
}