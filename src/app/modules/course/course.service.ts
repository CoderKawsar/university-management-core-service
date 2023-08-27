import { Course, CourseFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import {
  ICourseCreateData,
  IPreRequisiteCourseRequest,
} from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({ data: courseData });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
    }

    // for (let index = 0; index < preRequisiteCourses.length; index++) {
    //   await transactionClient.courseToPrerequisite.create({
    //     data: {
    //       courseId: result.id,
    //       preRequisiteId: preRequisiteCourses[index].courseId,
    //     },
    //   });
    // }

    // using updated custom for loop from utils
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPreRequisiteCourseRequest) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              preRequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: {
        faculties: true,
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
};

const getAllFromDB = async () => {
  const result = await prisma.course.findMany({
    include: {
      preRequisite: true,
      preRequisiteFor: true,
      faculties: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<ICourseCreateData>
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: { id },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course!');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisites = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && coursePrerequisite.isDeleted
      );

      const newPrerequisites = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && !coursePrerequisite.isDeleted
      );

      // for (let index = 0; index < deletePrerequisite.length; index++) {
      //   await transactionClient.courseToPrerequisite.deleteMany({
      //     where: {
      //       AND: [
      //         {
      //           courseId: id,
      //         },
      //         {
      //           preRequisiteId: deletePrerequisite[index].courseId,
      //         },
      //       ],
      //     },
      //   });
      // }

      // using updated custom for loop from utils
      asyncForEach(
        deletePrerequisites,
        async (deletePrerequisite: IPreRequisiteCourseRequest) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePrerequisite.courseId,
                },
              ],
            },
          });
        }
      );

      asyncForEach(
        newPrerequisites,
        async (newPrerequisite: IPreRequisiteCourseRequest) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: newPrerequisite.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: { id },
    include: {
      faculties: true,
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return responseData;
};

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map((facultyId: string) => ({
      courseId: id,
      facultyId,
    })),
  });

  const assignedFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return assignedFacultiesData;
};

const removeFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });

  const assignedFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return assignedFacultiesData;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  assignFaculties,
  removeFaculties,
};
