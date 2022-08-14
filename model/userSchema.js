const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.pre("save", async function(next) {
    console.log("I am in")

    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token:token });
        await this.save();
        return token;
    }catch(err) {
        console.log(err);
    }
}

const User = mongoose.model("USER", userSchema)

module.exports = User;











































// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required:true
//     },
//     email: {
//         type: String,
//         required:true
//     },
//     password: {
//         type: String,
//         required:true
//     }
// })

// const User = mongoose.model('USER', userSchema);

// module.exports = User;

// const User = new mongoose.Schema(
//     {
//         userName: {type: String, required: true},
//         email: {type: String, required: true, unique: true},
//         password: {type: String, required: true},
//         quote: {type: String},
//     },
//     {collection: "user-data"}
// )

// const model = mongoose.model("UserData", User);
// module.exports = model;