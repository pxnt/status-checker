import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";

import routes from "../routes/index.js";

function bootApp() {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }));

  // Pre-flight requests
  app.options('*', cors());

  app.use(cookieParser());
  app.use(compression());
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 5000,
  }));


  // Routes
  // app.use('/', roomRouter);
  // app.use('/', metaRouter);
  app.use('/', routes);

  return app;
}

export default bootApp;