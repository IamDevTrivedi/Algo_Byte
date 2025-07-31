const Comment=require('../models/comment')
const Post=require("../models/post")

const getAllComments=async(req,res)=>{
    try {
        const { postId } = req.params;
        
        
        const comments = await Comment.find({ postId })
          .sort({ createdAt: -1 })
          .populate("userId", "firstName")
          .populate({
            path: "replies",
            populate: { path: "userId", select: "firstName" },
          })
          .lean();
          
        res.status(200).json(comments);
      } catch (err) {

        res.status(500).json({ error: "Failed to fetch comments" });

      }
}

const createComment=async(req,res)=>{
    try{
        const userId = req.result._id;
        const { postId, content } = req.body;

        if (!postId || !content) {
        return res.status(400).json({ error: "Missing postId or content" });
        }

        const newComment = await Comment.create({
            postId,
            content,
            userId,
        });

        const populatedComment = await Comment.findById(newComment._id)
        .populate("userId", "firstName")
        .lean();

        req.io.emit("new-comment", populatedComment);

        res.status(201).json(populatedComment);
    }
    catch(err){
        res.status(400).json({ error: "Failed to create comment" });
    }
}

const commentOperation=async(req,res)=>{
    try {
        const commentId = req.params.id;
        const userId = req.result._id;
    
        const comment = await Comment.findById(commentId);
        if (!comment) 
            return res.status(404).json({ error: "Comment not found" });
    
        const alreadyLiked = comment.likes?.includes(userId);
    
        if (alreadyLiked) {
          comment.likes.pull(userId);
        } else {
          comment.likes.push(userId);
        }
    
        await comment.save();
    
        req.io.emit("comment-like-updated", {
          commentId,
          likes: comment.likes,
        });
    
        res.status(200).json({ commentId, likes: comment.likes });
      } catch (err) {
        res.status(500).json({ error: "Failed to toggle like" });
      }
}

const deleteComment=async(req,res)=>{
    try {
        const commentId = req.params.id;
        const userId = req.result._id;
    
        const comment = await Comment.findById(commentId);
        if (!comment) 
            return res.status(404).json({ error: "Comment not found" });
    
        if (comment.userId.toString() !== userId) {
          return res.status(403).json({ error: "Unauthorized: not your comment" });
        }
    
        await comment.deleteOne();
    
        req.io.emit("comment-deleted", { commentId });
    
        res.status(200).json({ message: "Comment deleted", commentId });

      } catch (err) {

        res.status(500).json({ error: "Failed to delete comment" });
      }
}

module.exports={createComment,deleteComment,commentOperation,getAllComments}