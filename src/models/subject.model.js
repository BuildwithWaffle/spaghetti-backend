import mongoose from "mongoose";


const SubjectSchema = new Schema(
  {
    
    subjectName: {
      type: String, // The full name of the subject.
      required: true,
      unique: true,
    },
    
    subjectCode: {
      type: String, // A unique code for the subject (e.g., "CS-301").
      required: true,
      unique: true,
    },
    
    description: {
      type: String,// A brief description of the subject.
    },
  },
  {
    collection: 'subjects',
  }
);


export const Subject = mongoose.model("Subject", SubjectSchema)