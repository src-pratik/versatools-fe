import { registerPlugin } from '@capacitor/core';


export interface SMSPlugin {
    getInbox(options: { timestamp?: number, maxresults?: number }): Promise<PluginResponse>;
}

export interface PluginResponse {
    success: boolean;
    message?: string;
    data?: any;
}


const SMS = registerPlugin<SMSPlugin>('SMS');


export { SMS };