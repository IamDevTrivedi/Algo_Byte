const mongoose = require('mongoose');
const { Schema } = mongoose;

const userStreakSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  lastSolvedDate: {
    type: Date
  },
  solvedDates: [
    {
      type: Date,
    },
  ]
}, { timestamps: true });

const UserStreak = mongoose.model('userStreak', userStreakSchema);
module.exports = UserStreak;
