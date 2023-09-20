import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();

const reviewSchema = new Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String
})

const linkSchema = new Schema({
    title: String,
    url: String
})

const commentSchema = new Schema({
    user: Object,
    comment: String,
    commentReplies: [Object]
})

const courseDataSchema = new Schema({
    videoUrl: String,
    // videoThumnail: Object,
    title: String,
    VideoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
})

const courseSchema = new Schema( {

    name: {
     type: String,
     required: true
    },
    description: {
     type: String,
     required: true
    },
    price: {
     type: String,
     required: true
    },
    estimaredPrice: {
     type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
            // required: true
        },
        url : {
            type: String,
            // required: true
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benifits: [{titles: String}],
    prerequisites: [{titles: String}],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }

},
{ timeStamp: true }  
  );

  const CourseModel = mongoose.model('Course', courseSchema);

  export default CourseModel;