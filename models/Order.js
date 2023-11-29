import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  productInfo:Object,
  name:String,
  email:String,
  year:String,
  branch:String,
  phone:String,
  enroll:String,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);