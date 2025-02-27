import { registerPlugin } from '@capacitor/core';

export interface EchoPlugin {
    echo(options: { value: string }): Promise<{ value: string }>;
}
export interface SMSPlugin {
    getInbox(options: { timestamp?: number, maxresults?: number }): Promise<PluginResponse>;
}

export interface PluginResponse {
    success: boolean;
    message?: string;
    data?: any;
}

const Echo = registerPlugin<EchoPlugin>('Echo');
const SMS = registerPlugin<SMSPlugin>('SMS');

export default Echo;

export { Echo, SMS };