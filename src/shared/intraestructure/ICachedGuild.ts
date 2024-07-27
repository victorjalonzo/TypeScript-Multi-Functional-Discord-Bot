import { IGuild } from "../../Guild/domain/IGuild.js";

export interface ICachedGuild extends IGuild {
    _id: string;
    save: () => Promise<void>;
}