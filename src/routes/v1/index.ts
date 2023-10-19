import express, { Router } from 'express';
import employerRoutes from './employee.route';
const router: Router = express.Router();
router.use('/', employerRoutes)
export default router;
