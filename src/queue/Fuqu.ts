
import * as pubSub from './GooglePubSub';

export type FuquOptions = pubSub.GooglePubSubOptions | object;

export type FuquRequestData = pubSub.GooglePubSubRequestData | object;

export type FuquCallback<Message> = (message: Message) => void;

export interface FuquOperations {
    in(data: any): Promise<any>;
    off(callback: FuquCallback<any>): any;
}

export interface FuquMessage {
    id: string;
    data: any;
    ack(): void;
    nack(): void;
}

export enum FuquType {
    custom = 'custom',
    googlePubSub = 'googlePubSub',
}

export class Fuqu<Message extends FuquMessage = FuquMessage> implements FuquOperations {
    private instance: FuquOperations;
    constructor(private type: FuquType, private options: FuquOptions, private adapter?: string) {
        switch (type) {
            case FuquType.googlePubSub:
                this.instance = new pubSub.GooglePubSub(options as pubSub.GooglePubSubOptions);
                break;
            case FuquType.custom:
                if (!this.adapter) {
                    throw new Error('Adapter must be set');
                }
                const adapt = require(this.adapter!);
                this.instance = new adapt(options);
                break;
            default:
                throw new Error(`Unsupported type ${type}`);
        }
    }
    public in(data: FuquRequestData): Promise<any> {
        return this.instance.in(data);
    }
    public off(callback: FuquCallback<Message>): any {
        return this.instance.off(callback);
    }
}