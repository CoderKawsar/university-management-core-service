import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Course Title is required!',
    }),
    code: z.string({
      required_error: 'Course Code is required!',
    }),
    credits: z.number({
      required_error: 'Course Credits is required!',
    }),
    preRequisiteCourses: z
      .array(
        z
          .object({
            courseId: z.string().optional(),
          })
          .optional()
      )
      .optional(),
  }),
});

export const CourseValidation = {
  create,
};
