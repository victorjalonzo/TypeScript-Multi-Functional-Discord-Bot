import { IGuild } from "./IGuild.js";
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js";
import { ICredit } from "../../Credit/domain/ICredit.js";
import { IPaypoint } from "../../PaypointRole/domain/IPaypointRole.js";
import { IRole } from "../../Role/domain/IRole.js";

export class Guild implements IGuild {
    public id: string
    public name: string
    public icon: string | null
    public createdAt: Date = new Date()
    public paypoints: IPaypoint[] = []
    public casualPayments: ICasualPayment[] = []
    public credits: ICredit[] = []
    public inviteData: unknown
    public defaultCredits: number = 0
    public defaultRole?: IRole | null = null
    public defaultNotificationChannel?: IRole | null = null
    public defaultInvoiceChannel?: IRole | null = null

    constructor(props: Omit<IGuild, 'inviteData'>){
        this.id = props.id
        this.name = props.name
        this.icon = props.icon
        this.createdAt = props.createdAt
        this.paypoints = props.paypoints
        this.casualPayments = props.casualPayments
        this.credits = props.credits
        this.defaultCredits = props.defaultCredits
        this.defaultRole = props.defaultRole
        this.defaultNotificationChannel = props.defaultNotificationChannel
        this.defaultInvoiceChannel = props.defaultInvoiceChannel
    }
}