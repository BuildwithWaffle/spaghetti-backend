import mongoose, { Schema } from "mongoose";

const ContentBaseSchema = new Schema(
    {
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        rextContentPreview: {
            type: String
        },
        isOfficial: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived', 'pending_review'],
            default: 'published',
        },
        
    },
    {
    discriminatorKey: 'contentType',
    collection: 'contents',
    timestamps: true,
  }
)


export const ContentBase = mongoose.model('ContentBase', ContentBaseSchema);