import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationFilterableFields } from './SemesterRegistration.constants';
import { SemesterRegistrationService } from './SemesterRegistration.service';

const addToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.addToDB(req.body);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Created Successfully!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, SemesterRegistrationFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    options
  );
  sendResponse<SemesterRegistration[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Semester Registrations Served Successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.getByIdFromDB(req.params.id);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Served Successfully!',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.updateOneInDB(
    req.params.id,
    req.body
  );
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration updated successfully!',
    data: result,
  });
});

export const SemesterRegistrationController = {
  addToDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
};
