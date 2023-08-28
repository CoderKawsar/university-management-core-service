import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start Date is required!',
    }),
    endDate: z.string({
      required_error: 'End Date is required!',
    }),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number({ required_error: 'minCredit is required!' }),
    maxCredit: z.number({ required_error: 'minCredit is required!' }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester ID is required!',
    }),
  }),
});

const update = z.object({
  body: z.object({
    startDate: z.string({}).optional(),
    endDate: z.string({}).optional(),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string({}).optional(),
  }),
});

export const SemesterRegistrationValidation = {
  create,
  update,
};
