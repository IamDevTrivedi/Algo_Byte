const Post=require('../models/post');
const io=require('socket.io')

const getMyPosts=async(req,res)=>{
    try{
        const userId=req.result._id;
        
        const posts = await Post.find({userId})
            .sort({ createdAt: -1 })
            .populate("userId", "firstName")
            .lean();
            
        res.status(200).json({
            posts,
          });
    }
    catch(err){
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}

const getAllPosts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstName")
        .lean();
  
      const totalPosts = await Post.countDocuments();
  
      res.status(200).json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  };
  

const createPost=async(req,res)=>{
    try{
        const userId=req.result._id;
        const {title,content}=req.body;

        if(!userId||!title||!content)
            return res.status(400).json({ error: "Some fields are missing" });

        const newPost=await Post.create({
            userId,
            title,
            content
        })

        const populatedPost = await Post.findById(newPost._id)
        .populate("userId", "name")
        .lean();
  
        // Emit to Socket.IO
        req.io.emit("new-post", populatedPost);

        res.status(201).json(populatedPost);
    }
    catch(err){
        res.status(400).json({ error: "Failed to create post" });
    }
}

const postOperation=async(req,res)=>{
    try{

        const postId = req.params.id;
        const userId = req.result._id;

        const post=await Post.findById(postId);

        if (!post) 
            return res.status(404).json({ error: "Post not found" });

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId); // unlike
        } else {
            post.likes.push(userId); // like
        }

        await post.save();

        req.io.emit("like-updated", { postId, likes: post.likes });

        res.status(200).json({ postId, likes: post.likes });
    }
    catch(err){
        res.status(500).json({ error: "Failed Operation" });
    }
}

const deletePost=async(req,res)=>{
    try{
        const postId = req.params.id;
        const userId = req.result._id; 
        

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });
       
        if (post.userId.toString() != userId.toString()) {
            return res.status(403).json({ error: "Unauthorized: not your post" });
         }
        
        await post.deleteOne();

        req.io.emit("post-deleted", { postId });

        res.status(200).json({ message: "Post deleted successfully", postId });

        
    }
    catch(err){
        res.status(500).json({ error: "Failed to delete post" });
    }
}

module.exports={deletePost,createPost,postOperation,getAllPosts,getMyPosts}