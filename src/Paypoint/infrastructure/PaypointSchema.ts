import mongoose, { Schema, Document } from 'mongoose';
import { IPaypoint } from '../domain/IPaypoint.js';
import { ProductType } from '../../shared/domain/ProductTypeEnums.js';

const PaypointSchema = new Schema<IPaypoint & Document>({
    id: { type: String, required: true },
    media: { type: Buffer, default: null},
    mediaCodec: { type: String, default: null},
    title: { type: String, default: null },
    description: { type: String, default: null },
    paymentMethod: { type: String, default: null },
    productType: { type: String, required: true },
    messageId: { type: String, default: null },
    channelId: { type: String, default: null },
    createdAt: { type: Date, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true },
});

PaypointSchema.methods.isBasedOnCreditProduct = function (): boolean {
    return this.productType == ProductType.CREDIT ? true : false
}

PaypointSchema.methods.isBasedOnRoleProduct = function (): boolean {
    return this.productType == ProductType.ROLE ? true : false
}

export const PaypointModel = mongoose.model<IPaypoint & Document>('Paypoints', PaypointSchema);