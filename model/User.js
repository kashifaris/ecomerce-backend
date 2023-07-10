const mongoose = require('mongoose');
const {Schema} = mongoose;
const LocalStrategy = require('passport-local').Strategy


const userSchema= new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:Buffer,
        required:true
    },
    addresses: {
        type:[Schema.Types.Mixed]
    },
    orders: {
        type:[Schema.Types.Mixed]
    },
    role: {
        type:String,
        required:true,
        default: 'user'
    },
    salt: {
        type:Buffer,
        required:true,
    }
})

const virtual = userSchema.virtual('id');
virtual.get(()=>{
    return this._id;
})

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:(doc,ret)=>{delete ret._id}
})

userSchema.plugin(LocalStrategy, {
    usernameField : "email"});

exports.User = mongoose.model("User",userSchema);