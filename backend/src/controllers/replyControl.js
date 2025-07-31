const Reply=require('../models/reply');
const Comment=require('../models/comment');

const createReply=async(req,res)=>{
    try {
        const userId = req.result._id;
        const { commentId, content } = req.body;
    
        if (!commentId || !content) {
          return res.status(400).json({ error: "Missing commentId or content" });
        }
    
        const newReply = await Reply.create({
          commentId,
          content,
          userId,
        });
    
        // Push reply into the comment's reply array
        await Comment.findByIdAndUpdate(commentId, {
          $push: { replies: newReply._id },
        });
    
        const populatedReply = await Reply.findById(newReply._id)
          .populate("userId", "firstName")
          .lean();
    
        req.io.emit("new-reply", populatedReply);
    
        res.status(201).json(populatedReply);
      } catch (err) {
        res.status(400).json({ error: "Failed to create reply" });
      }
}

const deleteReply = async (req, res) => {
    try {
      const replyId = req.params.id;
      const userId = req.result._id;
  
      const reply = await Reply.findById(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });
  
      if (reply.userId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized: not your reply" });
      }
  
      await Comment.findByIdAndUpdate(reply.commentId, {
        $pull: { replies: reply._id },
      });
  
      await reply.deleteOne();
  
      req.io.emit("reply-deleted", { replyId });
  
      res.status(200).json({ message: "Reply deleted", replyId });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete reply" });
    }
  };

const getAllRepliesByComment=async(req,res)=>{
    try {
        const { commentId } = req.params;
    
        const replies = await Reply.find({ commentId })
          .sort({ createdAt: 1 }) 
          .populate("userId", "firstName")
          .lean();
    
        res.status(200).json(replies);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch replies" });
      }
}
module.exports={createReply,deleteReply,getAllRepliesByComment};
