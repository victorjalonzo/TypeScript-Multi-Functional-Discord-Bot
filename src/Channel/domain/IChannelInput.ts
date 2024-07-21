import {IChannel} from "./IChannel.js";
import { Result } from "../../shared/domain/Result.js";

export interface IChannelInputPort {
    create(channel: IChannel): Promise<Result<IChannel>>;
    update(filter: Record <string, any>, channel: IChannel): Promise<Result<IChannel>>
    delete(filter: Record <string, any>, channel: IChannel): Promise<Result<Record<string, any>>>;
}