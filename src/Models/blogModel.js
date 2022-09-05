const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            
        },
        body: {
            type: String,
            required: true
        },
        authorId: {
            type: ObjectId,
            refs: ' Author',
            required: true,
           
        },
        tags: [String],
        category: [{
            type: String,
            required: true, 
            
        }],
        subcategory: mongoose.Schema.Types.Mixed, 
           
        
        deletedAt: {
            type: Date,
            // default:null
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date,
            default:null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model('Blogs', blogSchema)