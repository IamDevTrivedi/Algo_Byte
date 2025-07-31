// models/ProblemOfTheDay.js
const mongoose = require('mongoose')

const problemOfTheDaySchema = new mongoose.Schema({
  
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'problem',
    required: true,
  },
  flag:{
    type:Boolean,
    default:true
  }
  
})

const POTD= mongoose.model('ProblemOfTheDay', problemOfTheDaySchema)
module.exports=POTD;
