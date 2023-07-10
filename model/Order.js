const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  items: {
    type: [Schema.Types.Mixed],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: String,
    required: true,
  },
  totalItems: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  selectedAddress: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const virtual = orderSchema.virtual("id");
virtual.get(() => {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
