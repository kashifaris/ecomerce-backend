const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema= new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    price: {
        type:Number,
        min:[1,"minimum Price allowed is 1"],
        max:[100000,"maximum Price allowed is 100000"],
    },
    discountPercentage: {
        type:Number,
        min:[0,"minimum discount Percentage allowed is 1"],
        max:[99,"maximum discount Percentage allowed is 99"],
    },
    rating: {
        type:Number,
        min:[0,"minimum rating allowed is 0"],
        max:[5,"maximum rating allowed is 5"],
    },
    stock: {
        type:Number,
        min:[0,"minimum rating allowed is 0"],
        default:0
    },
    brand: {
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    thumbnail: {
        type:String,
        required:true
    },
    images: {
        type:[String],
        required:true
    },
    deleted: {
        type:Boolean,
        required:true,
        default:false
    },
})

const virtual = productSchema.virtual('id');
virtual.get(()=>{
    return this._id;
})

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:(doc,ret)=>{delete ret._id}
})

exports.Product = mongoose.model("Product",productSchema);