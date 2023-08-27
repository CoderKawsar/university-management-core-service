import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = Router();

router.post(
  '/',
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDB
);

router.get('/', CourseController.getAllFromDB);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.updateOneInDB
);

// assign faculties to a course
router.post(
  '/:id/assign-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  CourseController.assignFaculties
);

// remove faculties from a course
router.delete(
  '/:id/remove-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  CourseController.removeFaculties
);

export const CourseRoutes = router;
