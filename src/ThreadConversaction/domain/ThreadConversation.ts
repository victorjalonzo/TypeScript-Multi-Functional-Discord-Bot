import { IMember } from "../../Member/domain/IMember.js"
import { createRandomId } from "../../shared/utils/IDGenerator.js"
import { IThreadConversation } from "./IThreadConversation.js"
import { ThreadConversationState } from "./ThreadConversationStateEnums.js"
import { ICasualPayment } from "../../CasualPayment/domain/ICasualPayment.js"
import { ICreditProduct } from "../../CreditProduct/domain/ICreditProduct.js"
import { IRoleProduct } from "../../RoleProduct/domain/IRoleProduct.js"
import { ProductType } from "../../shared/domain/ProductTypeEnums.js"
import { IGuild } from "../../Guild/domain/IGuild.js"

interface IProps {
    member: IMember
    guild: IGuild
    casualPaymentMethod: ICasualPayment
    product: IRoleProduct | ICreditProduct
    threadChannelId: string
    paymentFrom?: string
}

export class ThreadConversation implements IThreadConversation {
    public id: string = createRandomId()
    public member: IMember
    public memberId: string
    public guild: IGuild
    public guildId: string
    public casualPaymentMethodId: string
    public casualPaymentMethodName: string
    public casualPaymentMethodValue: string
    public productId: string
    public productName: string
    public productPrice: number
    public productType: ProductType
    public botTurn: boolean = true
    public state: ThreadConversationState = ThreadConversationState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE
    public history: string[] = []
    public paymentFrom?: string | undefined
    public invoices: Buffer[] = []
    public casualTransactionId?: string | null = null
    public threadChannelId: string
    public updatableMessageId?: string
    public createdAt: Date = new Date()

    constructor (props: IProps) {
        this.member = props.member
        this.memberId = props.member.id

        this.casualPaymentMethodId = props.casualPaymentMethod.id
        this.casualPaymentMethodName = props.casualPaymentMethod.name
        this.casualPaymentMethodValue = props.casualPaymentMethod.value

        this.productId = props.product.id
        this.productName = props.product.name
        this.productPrice = props.product.price
        this.productType = props.product.type

        this.threadChannelId = props.threadChannelId
        this.paymentFrom = props.paymentFrom

        this.guild = props.guild
        this.guildId = props.guild.id
    }

    isWaitingAdminApproval = (): boolean => this.state === ThreadConversationState.WAITING_ADMIN_TO_APPROVE_PAYMENT
    isWaitingUserPaymentReceipt = (): boolean => this.state === ThreadConversationState.WAITING_USER_TO_PROVIDE_RECEIPT_IMAGE
    isClosed = (): boolean => this.state === ThreadConversationState.CLOSED
    isCancelled = (): boolean => this.state === ThreadConversationState.CANCELLED
}