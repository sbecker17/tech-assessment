const mongoose = require(`mongoose`);

const orderSchema = new mongoose.Schema({
    item_id: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model(`Order`, orderSchema);


// {"item_id":1,"quantity":4,"customer";"Stark"}