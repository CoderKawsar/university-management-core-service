import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { FacultySearchableFields } from './Faculty.constants';
import { IFacultyFilterRequest } from './Faculty.interface';

const createFaculty = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};

const getAllFacultys = async (
  filters: IFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: FacultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.faculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getFacultyById = async (id: string): Promise<Faculty | null> => {
  const result = prisma.faculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: { id },
  });
  return result;
};

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map((courseId: string) => ({
      facultyId: id,
      courseId,
    })),
  });

  const assignedCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return assignedCoursesData;
};

const removeCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  const assignedCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return assignedCoursesData;
};

export const FacultyService = {
  createFaculty,
  getAllFacultys,
  getFacultyById,
  updateFaculty,
  deleteFromDB,
  assignCourses,
  removeCourses,
};
