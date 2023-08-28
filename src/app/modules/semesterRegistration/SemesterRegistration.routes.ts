import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './SemesterRegistration.controller';
import { SemesterRegistrationValidation } from './SemesterRegistration.validation';
// import { SemesterRegistrationValidation } from './SemesterRegistration.validation';

const router = Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(SemesterRegistrationValidation.create),
  SemesterRegistrationController.addToDB
);

router.get('/', SemesterRegistrationController.getAllFromDB);

router.get('/:id', SemesterRegistrationController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  SemesterRegistrationController.updateOneInDB
);

export const SemesterRegistrationRoutes = router;
