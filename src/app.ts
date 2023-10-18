import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import lowercasePaths from 'express-lowercase-paths';

import './config/db';
import { successLogHandler, errorLogHandler } from './config/logger';
import routesV1 from './routes/v1';
import errorHandler from './middlewares/error';
import ApiError from './utils/ApiError';

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// Setting proxy
app.set('trust proxy', true);

app.use(successLogHandler);
app.use(errorLogHandler);

// set security HTTP headers
app.use(helmet());

// json body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());


// redirects any requests which contain uppercase chars to their lowercase forms
app.use(lowercasePaths());

// v1 api routes
app.use('/v1', routesV1);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Endpoint is invalid.'));
});

app.use(errorHandler);

export default app;
