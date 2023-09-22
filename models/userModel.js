const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        required:[true, 'Role is required'],
        enum:['admin','donar','organisation','hospital']
    },
    name:{
        type:String,
        required:function(){
            if(this.role === "user" || this.role === "admin"){
                return true;
            }
            return false;
        }
    },
    organisationName: {
        type: String,
        required: function () {
            if (this.role === "organisation") {
                return true;
            }
            return false;
        },
    },
    hospitalName:{
        type:String,
        required:function(){
            if(this.role === "hospital" ){
                return true;
            }
            return false;
        }
    },
    email:{
        type:String,
        required:[true, 'required field'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'required field'],
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true, 'required field'],
    },
    phone:{
        type:Number,
        required:[true, 'required field'],
    }
}, {timestamps:true});

module.exports = mongoose.model('users', userSchema);