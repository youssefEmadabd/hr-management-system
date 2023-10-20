import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { employeeController } from '../../controllers';

import auth from '../../middlewares/auth';
import RefreshTokenAuth from '../../middlewares/refreshTokenAuth';

const router: Router = express.Router();

router.route('/')
    .get(asyncHandler(auth), asyncHandler(employeeController.getAllNormalEmployees))

router.route('/:id').patch(asyncHandler(auth), asyncHandler(employeeController.update))

router.post('/login', asyncHandler(employeeController.login));
router.post('/register', asyncHandler(employeeController.register));
router.post('/reset-token',asyncHandler(RefreshTokenAuth),asyncHandler(employeeController.generateAccessToken))


export default router;