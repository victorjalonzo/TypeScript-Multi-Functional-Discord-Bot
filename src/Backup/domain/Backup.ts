import { IGuild } from "../../Guild/domain/IGuild.js";
import { IBackup } from "./IBackup.js";

interface IProps extends Omit<IBackup, "createdAt"> {}

export class Backup implements IBackup {
    guildId: string
    guild: IGuild
    name: string
    createdBy: string
    createdAt: Date = new Date()

    constructor (props: IProps) {
        this.guildId = props.guildId
        this.guild = props.guild
        this.name = props.name
        this.createdBy = props.createdBy
    }
}