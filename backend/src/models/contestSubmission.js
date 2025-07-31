// models/ContestSubmission.js

const mongoose = require('mongoose')

const contestSubmissionSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contest',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String, 
    required: true,
  },
  status: {
    type: String, 
    required: true,
  },
  executionTime: {
    type: Number, 
  },
  memoryUsed: {
    type: Number, 
  },
  testCasePassedCount: {
    type: Number,
    default: 0,
  },
  totalTestCases: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0, 
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
})

const ContestSubmission = mongoose.model('contestSubmission', contestSubmissionSchema)
module.exports=ContestSubmission