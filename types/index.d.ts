// declare modules here
import express from "express";
declare module "express-session" {
  interface SessionData {
    user:
      | {
          id: number;
          email: string;
          username: string;
          projectsAllowed: number[];
        }
      | undefined
      | null;
    returnTo: string;
  }
}

function controller(req: express.Request, res: express.Response) {
  req.session.user;
  req.session.returnTo;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      BASE_URL: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DATABASE: string;
      DB_HOST: string;
      DB_DIALECT: string;
      DB_QUERY_LOG: string;
      AUTO_SYNC_MODELS: string;
      AWS_SES_KEY: string;
      AWS_SES_SECRET: string;
      AWS_SES_ENDPOINT: string;
      AWS_SES_REGION: string;
      EMAIL_TOKEN_HASH_SECRET: string;
      AWS_SES_EMAIL_ADDRESS: string;
      AWS_S3_REGION: string;
      AWS_S3_KEY: string;
      AWS_S3_SECRET: string;
      AWS_S3_ENDPOINT: string;
      AWS_S3_BUCKET_NAME: string;
    }
  }
}
