

const mongoose = require('mongoose')

const contestParticipantsSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contest',
    required: true,
  },
  exited: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  testCasePassedCount: {
    type: Number,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0, 
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  finished:{
    type:Boolean,
  },
  rank:{
    type:Number
  }
})

const ContestParticipants = mongoose.model('contestparticipants', contestParticipantsSchema)
module.exports=ContestParticipants