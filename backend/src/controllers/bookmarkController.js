
const BookMark=require('../models/bookmark')
const Problem = require("../models/problemSchema")


const getUserBookmarks = async (req, res) => {
  try {
    const userId=req.result._id;
    if(!userId)
        throw new Error("userId is missing");


    const lists = await BookMark.find({ userId: userId })

    res.status(200).json(lists)

  } catch (err) {

    console.error("Error in getUserBookmarks:", err)
    res.status(500).json({ error: "Failed to fetch bookmark lists" })

  }
}


const createBookmarkList = async (req, res) => {
    
    try {

      const { name, problemIds } = req.body
      if (!name?.trim()) 
            return res.status(400).json({ error: "List name is required" })
      
      const userId=req.result._id;
      if(!userId)
        throw new Error("userId is missing");


      const newList = new BookMark({
        userId: userId,
        name: name.trim(),
        problemIds: problemIds || [],
      })
  
      await newList.save()
      res.status(201).json(newList)


    } catch (err) {

      console.error("Error in createBookmarkList:", err)
      res.status(500).json({ error: "Failed to create list" })
    }
  }
  

const addProblemToList = async (req, res) => {
    
    try {

      const { listId, problemId } = req.body
      if (!listId || !problemId) 
        return res.status(400).json({ error: "listId and problemId are required" })
      
      const userId=req.result._id;
      if(!userId)
        throw new Error("userId is missing");

      const list = await BookMark.findOne({ _id: listId, userId: userId })
  
      if (!list) 
        return res.status(404).json({ error: "List not found" })
  
      if (!list.problemIds.includes(problemId)) {
        list.problemIds.push(problemId)
        await list.save()
      }
  
      res.status(200).json({ message: "Problem added successfully" })
    } catch (err) {

      console.error("Error in addProblemToList:", err)
      res.status(500).json({ error: "Failed to add problem to list" })
    }
  }




const getBookmarkProblems = async (req, res) => {
  

  try {
    const { problemIds } = req.body

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        return res.status(400).json({ error: "No problem IDs provided" })
    }


    const problems = await Problem.find({ _id: { $in: problemIds } })

    res.status(200).json(problems)
  } catch (error) {

    console.error("Error fetching bookmark problems:", error)
    res.status(500).json({ error: "Internal server error" })

  }
}

const deleteList=async(req,res)=>{
    try{
        const listId=req.params.listId;

        if(!listId)
            throw new Error("listId is missing");

        await BookMark.findByIdAndDelete(listId);

        res.status(200).json({ message: "List deleted" })
    }
    catch(err){
        res.send(err.message)
    }
}

const removeProblemFromList=async(req,res)=>{
    
  try {
    const { listId, problemId } = req.body

    if (!listId || !problemId) {
        return res.status(400).json({ error: "listId and problemId are required" })
    }

    const updated = await BookMark.findByIdAndUpdate(
      listId,
      { $pull: { problemIds: problemId } },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: "Bookmark list not found" })
    }

    res.status(200).json({ message: "Problem removed", updated })

  } catch (error) {

    console.error("Error removing problem:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
module.exports={getUserBookmarks,createBookmarkList,addProblemToList,getBookmarkProblems,deleteList,removeProblemFromList}