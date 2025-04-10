import {Router} from "express"
import User from "../models/user.js"
import {createTokenForUser,} from "../services/authentication.js"
const router=Router()


router.get("/signup",(req,res)=>{
    return res.render("signup")
})
router.get("/signin",(req,res)=>{
    return res.render("signin")
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.matchPassword(email,password)
        
        if (user) {
            //generating the token here
            const token=createTokenForUser(user)
            
            return res.cookie("token",token).redirect("/");
        }
    } catch (error) {
        return res.render("signin", { error: error.message });
    }
});

router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body
   await User.create({
     fullName:fullName,
     email:email,
     password:password,
   })
     return res.render("signin")
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})



export default router;
