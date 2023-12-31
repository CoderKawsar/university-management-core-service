import { Course } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDB(req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getAllFromDB();

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course served successfully!',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.updateOneInDB(req.params.id, req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully!',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.assignFaculties(
    req.params.id,
    req.body.faculties
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties added successfully!',
    data: result,
  });
});

const removeFaculties = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.removeFaculties(
    req.params.id,
    req.body.faculties
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed successfully!',
    data: result,
  });
});

export const CourseController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  assignFaculties,
  removeFaculties,
};
