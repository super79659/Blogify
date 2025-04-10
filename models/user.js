import {Schema,model} from "mongoose"
 import {createHmac,randomBytes} from "crypto"

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
    profileImageURL:{
        type:String,
        default:"/images/default.avif"
    }


},{timestamps:true})

userSchema.pre('save', function(next) {
   const user=this
   if(!user.isModified("password")) return 
   const salt =randomBytes(16).toString()
   const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex")
   this.password=hashedPassword
   this.salt=salt
    next();
  });

  userSchema.static("matchPassword",async function (email,password){
   const user=await this.findOne({email:email})
  
   if(!user) {
    throw new Error("Incorrect user")
   
   }
   const salt=user.salt
   const userProvidedHash=createHmac("sha256",salt).update(password).digest("hex")
  if(user.password!==userProvidedHash) throw new Error("Incorrect  Password")
   return user
  })
const User=model("user",userSchema)
export default User;