import { model, Schema } from "mongoose"

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [8, "Title must be atleast 8 character"],
        maxLength: [60, "Title should be less than 8 character"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [8, "Description must be atleast 8 character"],
        maxLength: [200, "Description should be less than 200 character"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    thumbnail: {
        public_id: {
            type: String,
            required: [true, "Thumbnail is required"]
        },
        secure_url: {
            type: String
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String
                },
                secure_url: {
                    type: String
                }
            }

        }
    ],
    numberOfLectures:{
        type: Number,
        default: 0
    },
    createdBy:{
        type: String,
        required: [true, "Createdby is required"]
    }

},
{
    timestamps: true
});

const Course = model("Course", courseSchema)

export default Course