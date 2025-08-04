import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const UserSemesterAccessSchema = new Schema(
  {
    
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user document.
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: 'Semester', // Reference to the semester document.
      required: true,
    },
  },
  {
    collection: 'userSemesterAccess',
  }
);

UserSemesterAccessSchema.plugin(mongooseAggregatePaginate)

export const UserSemesterAccess = mongoose.model("UserSemesterAccess", UserSemesterAccessSchema)