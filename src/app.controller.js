import rateLimit from 'express-rate-limit';
import checkConnectionDB from './DB/connectionDB.js';
import messageRouter from './modules/messages/message.controller.js';
import userRouter from './modules/user/user.controller.js';
import cors from 'cors';
import helmet from 'helmet';

var whitelist = [process.env.FRONT_ORIGIN, undefined];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const bootstrap = (app, express) => {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
      error: 'Too Many Requests , try again Later',
    },
  });
  app.use(cors(corsOptions));

  app.use(limiter);
  app.use(helmet());

  app.use(express.json());

  checkConnectionDB();
  app.use('/uploads', express.static('uploads'));

  app.use('/user', userRouter);
  app.use('/message', messageRouter);
  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({
      sucess: false,
      message: 'API end point not found',
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(err.errors && { errors: err.errors }), // For validation details
    });
  });
};

export default bootstrap;
