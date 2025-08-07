import { ContentBase } from "./contentBase.model";

const NoteSchema = new Schema(
  {
    // Keywords for the note, stored as a string array for easy search/tagging.
    keywords: {
      type: [String],
      required: false,
    },
  },
  {}
);

const PYQSchema = new Schema(
  {
    // The year the question paper is from.
    year: {
      type: Number,
      required: true,
    },
    // The type of exam (e.g., Midterm, Final).
    examType: {
      type: String,
      required: true,
    },
    // URL to the solution file in cloud storage. Nullable.
    solutionFileUrl: {
      type: String,
      required: false,
    },
  },
  {}
);


const SyllabusSchema = new Schema(
  {
    // The version of the syllabus (e.g., "v1.0").
    version: {
      type: String,
      required: false,
    },
    // The date this syllabus became effective.
    effectiveDate: {
      type: Date,
      required: false,
    },
  },
  {}
);

export const Note = ContentBase.discriminator("NoteSchema", NoteSchema)
export const PYQ = ContentBase.discriminator('PYQ', PYQSchema);
export const Syllabus = ContentBase.discriminator('Syllabus', SyllabusSchema);