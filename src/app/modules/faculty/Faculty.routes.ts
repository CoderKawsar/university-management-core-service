import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './Faculty.controller';
import { FacultyValidation } from './Faculty.validation';

const router = Router();

// create a Faculty
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.create),
  FacultyController.createFaculty
);

// get all Facultys
router.get('/', FacultyController.getAllFacultys);

// get single Faculty using id
router.get('/:id', FacultyController.getFacultyById);

// update single Faculty by id
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.update),
  FacultyController.updateFaculty
);

// delete single Faculty by id
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFromDB
);

// assign faculties to a course
router.post(
  '/:id/assign-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.assignCourses
);

// remove faculties from a course
router.delete(
  '/:id/remove-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.removeCourses
);

export const FacultyRoutes = router;
