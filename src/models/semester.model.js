import mongoose, {Schema} from "mongoose";

const SemesterSchema = new Schema(
  {
    semesterNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'semesters',
  }
);

export const Semester = mongoose.model("Semester", SemesterSchema); 