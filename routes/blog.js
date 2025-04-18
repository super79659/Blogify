import {Router} from "express"
import multer from "multer"
import path from "path"
import Blog from "../models/blog.js"
import Comment from "../models/comment.js"
const router=Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`
      cb(null,filename  )
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
})
router.post("/",upload.single("coverImage") ,async (req,res)=>{
    const {title,body}=req.body
   const blog=await Blog.create({
 body:body,
 title:title,
 createdBy:req.user._id,
 coverImageURL:`/uploads/${req.file.filename}`,
   })
    return res.redirect(`/blog/${blog._id}`)
})

router.get("/:id",async (req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy")
  const comments=await Comment.find({blogId:req.params.id}).populate("createdBy")

  return res.render("blog",{
    user:req.user,
    blog:blog,comments:comments, 
  })
})

router.post("/comment/:blogId",async (req,res)=>{
  await Comment.create({
  content:req.body.content,
  createdBy:req.user._id,
  blogId:req.params.blogId,
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

export default router;
