import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const {Schema} = mongoose;
const InvoiceScehma = new Schema({
    item: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    due: {
        type: Date,
        required: true,
    },
    rate: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    client: {
        ref:'Client',
        type: Schema.Types.ObjectId,
        required: true,
    }
});
InvoiceScehma.plugin(mongoosePaginate);
export default mongoose.model('Invoice', InvoiceScehma);