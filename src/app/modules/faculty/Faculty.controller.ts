import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { FacultyFilterableFields } from './Faculty.constants';
import { FacultyService } from './Faculty.service';

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.createFaculty(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Created Successfully!',
    data: result,
  });
});

const getAllFacultys = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, FacultyFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await FacultyService.getAllFacultys(filters, options);
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facultys Served Successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getFacultyById = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getFacultyById(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Served Successfully!',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.updateFaculty(req.params.id, req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Updated Successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.deleteFromDB(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully!',
    data: result,
  });
});

const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.assignCourses(
    req.params.id,
    req.body.courses
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses added successfully!',
    data: result,
  });
});

const removeCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.removeCourses(
    req.params.id,
    req.body.courses
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses removed successfully!',
    data: result,
  });
});

export const FacultyController = {
  createFaculty,
  getAllFacultys,
  getFacultyById,
  updateFaculty,
  deleteFromDB,
  assignCourses,
  removeCourses,
};
