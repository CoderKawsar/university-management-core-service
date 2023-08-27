import { z } from 'zod';

const create = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: 'Faculty ID is required!',
    }),
    firstName: z.string({
      required_error: 'First Name is required!',
    }),
    lastName: z.string({
      required_error: 'Last Name is required!',
    }),
    middleName: z.string().optional(),
    email: z.string({
      required_error: 'Email is required!',
    }),
    profileImage: z.string().optional(),
    contactNo: z.string({
      required_error: 'Contact Number is required!',
    }),
    gender: z.string({
      required_error: 'Gender is required!',
    }),
    bloodGroup: z.string().optional(),
    designation: z.string(),

    academicDepartmentId: z.string(),
    academicFacultyId: z.string(),
  }),
});

const update = z.object({
  body: z.object({
    studentId: z.string({}).optional(),
    firstName: z.string({}).optional(),
    lastName: z.string({}).optional(),
    middleName: z.string().optional(),
    email: z.string({}).optional(),
    profileImage: z.string().optional(),
    contactNo: z.string({}).optional(),
    gender: z.string({}).optional(),
    bloodGroup: z.string().optional(),
    designation: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

const assignOrRemoveCourses = z.object({
  body: z.object({
    courses: z.array(z.string(), { required_error: 'Courses are required' }),
  }),
});

export const FacultyValidation = {
  create,
  update,
  assignOrRemoveCourses,
};
