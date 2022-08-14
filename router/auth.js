const jwt = require("jsonwebtoken")
const { json } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const cookieParser =require("cookie-parser");

router.use(cookieParser());

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
    res.send("Hello world from the server router js");
})

// router.post("/register", (req, res) => {

//     const { userName, email, password } = req.body

//     if(!userName || !email || !password) {
//         return res.status(422).json({ error: "Please fill the properties"});
//     }

//     User.findOne({ email:email}).then((userExist) => {
//         if(userExist) {
//             return res.status(422).json({erro: "Email already exist"});
//         }

//         const user = new User({ userName, email, password });

//         user.save().then(() => {
//             res.status(201).json({ message: "user registered successfully"});
//         }).catch((err) => res.status(500).json({ error: "Failed to register"}));

//     }).catch(err => { console.log(err)})

// })

router.post("/register", async (req, res) => {

    const { userName, email, phone, password, cpassword } = req.body

    if(!userName || !email || !phone || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill the properties"});
    }
    try{
        const userExist = await User.findOne({ email:email})

        if(userExist) {
            return res.status(422).json({erro: "Email already exist"});
        }
        else if(password != cpassword) {
            return res.status(422).json({erro: "Password is not matching"});
        }
        else {
            const user = new User({ userName, email, phone, password, cpassword });
            await user.save();
            res.status(201).json({ message: "user registered successfully"});
        }

    }catch(err) {
        console.log(err);
    }
})

// login route

router.post("/login", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json({error: "Please fill the data"})
        }

        const userLogin = await User.findOne({email:email});

        // console.log(userLogin)

        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            if(!isMatch) {
                res.status(400).json({message: "Invalid Credentials"});
            }
            else {
                res.json({message: "user loggedin successfully"});
            }
        }
        else {
            res.status(400).json({message: "Invalid Credentials"});
        }
    }catch(err) {
        console.log(err);
    }
})

router.get("/about", authenticate, (req, res) => {
    console.log("Hello my about");
    res.send(req.rootUser);
})

router.put("/about/:userId", (req, res,next) => {
    console.log(req.params.userId);
    User.findOneAndUpdate({_id:req.params.userId}, {
        $set: {
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone,
        }
    })
    .then(result => {
        res.status(200).json({
            updated_profile:result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;































































// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const User = require("./models/user")
// const jwt = require("jsonwebtoken");

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/animeverse")

// app.post("/signup", async (req, res) => {
//     console.log(req.body);
//     try{
//         await User.create({
//             userName: req.body.userName,
//             email: req.body.email,
//             password: req.body.password,
//         })
//         res.json({status: "ok"})
//     }catch (err) {
//         res.json({status: "error", error: "duplicate Email"})
//     }
// })

// app.post("/api/login", async (req, res) => {
//     const user = await User.findOne({
//         email: req.body.email,
//         password: req.body.password,
//     })

//     if(user) {
//         const token = jwt.sign(
//         {
//             userName: user.userName,
//             email: user.email,
//         },
//         "secret123"
//     )
        
//         return res.json({status: "ok", user: token})
//     }
//     else{
//         return res.json({status: "error", user: false})
//     }
// })

// app.listen(3000, (req, res) => {
//     console.log("Server is running on port 3000");
// })