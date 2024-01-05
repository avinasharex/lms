import Course from "../models/course.model.js";
import cloudinary from "cloudinary";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import { log } from "console";

const createCourses = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return new next(new AppError("All field are manadatory", 400));
  }

  try {
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: title,
        secure_url:
          "https://github.com/avinasharex/auth/blob/main/model/userSchema.js",
      },
    });

    if (!course) {
      return new next(
        new AppError("Course could not created, please try again", 400)
      );
    }

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          (course.thumbnail.public_id = result.public_id),
            (course.thumbnail.secure_url = result.secure_url);
        }

        // Remove file from server
        fs.rm("uploads/" + req.file.filename);
      } catch (e) {
        return next(new AppError(e.message, 500));
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndRemove(id, { id });

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const getAllCourses = async (req, res) => {
  const course = await Course.find({}).select("-lectures");

  res.status(200).json({
    success: true,
    message: "All course",
    course,
  });
};
const getCoursesById = async (req, res, next) => {
  const {id} = req.params

  if(!id){
    return new next(new AppError("Course ID is required", 400));
  }

  const course = await Course.findById(id)

  if(!course){
    return new next(new AppError("Course with given ID does not exist", 400));
  }
  res.status(200).json({
    success: true,
    message: "Course fetched successfully",
    course
  });

};

const addLectureToCourseById = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return new next(new AppError("All field are manadatory", 400));
  }

  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError("Course with given id does not exist", 500));
  }

  const lectureData = {
    title,
    description,
    lecture: {},
  };

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: 'video',
    
      })
    console.log(result);

      if (result) {
        (lectureData.lecture.public_id = result.public_id),
          (lectureData.lecture.secure_url = result.secure_url);
      }

      // Remove file from server
      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      for (const file of await fs.readdir('/uploads')){
        await fs.unlink(path.join('/uploads', file))
      }
      return next(new AppError(e.message, 500));
    }
  }

  course.lectures.push(lectureData);

  course.numberOfLectures = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture successfully uploaded to course",
  });
};

const removeLectureFromCourse = async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  if (!courseId) {
    return next(new AppError("Course ID is required", 400));
  }
  if (!lectureId) {
    return next(new AppError("Lecture ID is required", 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new AppError("Invalid course ID or course does not exist", 400)
    );
  }

  const lecture = course.lectures.id(lectureId);

  if (!lecture) {
    return next(new AppError("Lecture not found in course", 400));
  }

  // Remove the lecture by its ID
  lecture.deleteOne(lectureId);
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture deleted successfully from course",
  });
};

export {
  createCourses,
  updateCourse,
  removeCourse,
  getAllCourses,
  getCoursesById,
  addLectureToCourseById,
  removeLectureFromCourse,
};
