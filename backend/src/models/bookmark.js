

const mongoose=require('mongoose')
const { Schema } = mongoose

const bookmarkListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  problemIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "problem",
    },
  ],
}, {
  timestamps: true, // For createdAt and updatedAt
})

const BookMark= mongoose.model("bookmarkList", bookmarkListSchema)

module.exports = BookMark