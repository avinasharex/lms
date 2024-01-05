import { Schema, model } from "mongoose";

const contactusSchema = new Schema({
    name: {
        type: String,
        redquired: [true, "Name is required"],
        minLength: [5, "Title must be atleast 5 character"],
        maxLength: [60, "Title should be less than 8 character"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
    },
    message:{
        type: String,
        required: [true, "Message is required"],
        trim: true
    }
},{timestamps: true})

const Contactus = model('Contactus',contactusSchema)
export default Contactus