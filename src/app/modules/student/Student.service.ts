import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { StudentSearchableFields } from './Student.constants';
import { IStudentFilterRequest } from './Student.interface';

const createStudent = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicSemester: true,
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: StudentSearchableFields.map(field => ({
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

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
    where: whereConditions,
    include: {
      academicSemester: true,
      academicFaculty: true,
      academicDepartment: true,
    },
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
  const total = await prisma.student.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getStudentById = async (id: string): Promise<Student | null> => {
  const result = prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: { id },
  });
  return result;
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteFromDB,
};
