import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";

const userSchema  = new Schema(
    {
        userName : {
            type : String,
            require: true,
            unique:true,
            lowercase:true,
            trim: true,
            index: true
        },
        email : {
            type : String,
            require: true,
            unique:true,
            lowercase:true,
            trim: true,
            
        },
        fullName : {
            type : String,
            require: true,
            unique:true,
            trim: true,
            index: true
        },
        avatar : {
            type : String,  //cloudinary url
            require: true,
        },
        coverImage: {
            type: String ,  //cloudinary url
        },
        watchHisttory: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        password: {
            type: String,
            require: [true, 'Password is required']
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()

})

userSchema.methods.isPassword = async function(password){
    return await bcrypt,compare(password, this.password)
}

userSchema.method.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User" , userSchema)