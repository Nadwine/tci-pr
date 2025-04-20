import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import Joi from "joi";
import express from "express";
import session from "express-session";
import compression from "compression";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import { ModelDefined } from "sequelize";
import { getS3MediaForTestEnvironment } from "./src/server/routes/media";
import "./src/utils/initializeExtensions";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const resolve = (p: string) => path.resolve(__dirname, p);

async function initialiseModels() {
  // Init Models
  const shouldAutoSync = process.env.AUTO_SYNC_MODELS === "true" ? true : false;

  if (process.env.NODE_ENV === "development" && shouldAutoSync) {
    const syncOrder = [
      "feedback.ts",
      "user.ts",
      "listing_landlord.ts",
      "admin.ts",
      "listing.ts",
      "address.ts",
      "listing_enquiry.ts",
      "listing_question.ts",
      "listing_view.ts",
      "listing_saved.ts",
      "property_for_rent.ts",
      "listing_media.ts",
      "profile.ts",
      "profile_media.ts",
      "enquiry_conversation.ts",
      "message.ts",
      "tenancy.ts",
      "tenant.ts",
      "offer.ts",
      "property_document.ts",
      "tenancy_document.ts",
      "expense.ts",
      "tenancy_rent_payment.ts"
    ];
    const files = await fs.readdir("./src/database/models");
    files.sort(function (a, b) {
      if (syncOrder.indexOf(a) === -1 && syncOrder.indexOf(b) === -1) return 0;
      if (syncOrder.indexOf(a) === -1) return 1;
      if (syncOrder.indexOf(b) === -1) return -1;
      return syncOrder.indexOf(a) - syncOrder.indexOf(b);
    });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dbModel: ModelDefined<any, any> = await (await import(`./src/database/models/${file}`)).default;
      await dbModel
        .sync({ alter: true })
        .then(async () => {
          console.log(`successfully synced ${file} Model`);
        })
        .catch(async err => {
          console.error(`${file} Model failed to sync`, err?.message || err);
        });
    }
  }
}

const getStyleSheets = async () => {
  const assetpath = resolve("dist/assets");
  const files = await fs.readdir(assetpath).catch(err => console.log("failed to load asset images. are you missing NPM RUN BUILD!!!!"));
  const cssAssets = files?.filter(l => l.endsWith(".css"));
  const allContent = [];
  if (cssAssets) {
    for (const asset of cssAssets) {
      const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
      // @ts-ignore
      allContent.push(`<style type="text/css">${content}</style>`);
    }
  }
  return allContent.join("\n");
};

async function createServer(isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  // Imports
  const { Pool } = await import("pg");
  const pgSession = require("connect-pg-simple")(session);

  // Middleware setups
  const postgresConnectionPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info"
  });

  app.use(vite.middlewares);
  const oneDay = 86400;
  const thirtyDays = 2592000000;
  const oneMinute = 60000;
  const twoMinute = 120000;
  const requestHandler = express.static(resolve("assets"));
  app.use(requestHandler);
  app.use(
    session({
      store: new pgSession({
        pool: postgresConnectionPool,
        createTableIfMissing: true,
        tableName: "session",
        schemaName: "public"
      }),
      saveUninitialized: false,
      secret: "tcipr_hush",
      resave: false,
      cookie: { maxAge: thirtyDays }
    })
  );

  app.use("/assets", requestHandler);
  app.use("/api", await (await import("./src/server/api-router")).default);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(resolve("dist/client"), {
        index: false
      })
    );
  }

  app.get("/tcipr/*", getS3MediaForTestEnvironment);
  const stylesheets = getStyleSheets();

  app.get("/logout", (req: Request, res: Response) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
    const username = req.session.user?.username;
    req.session.destroy(() => console.log(`${username} has logged out`));
    return res.redirect("/");
  });

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile(isProd ? resolve("dist/client/index.html") : resolve("index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      let productionBuildPath = path.join(__dirname, "./dist/server/entry-server.mjs");
      let devBuildPath = path.join(__dirname, "./src/client/entry-server.tsx");
      const { render } = await vite.ssrLoadModule(isProd ? productionBuildPath : devBuildPath);
      const appHtml = await render(url);
      const cssAssets = isProd ? "" : await stylesheets;
      const html = template.replace(`<!--app-html-->`, appHtml).replace(`<!--head-->`, cssAssets);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log("vite console log", e.stack);
      if (process.env.NODE_ENV === "development") {
        vite.ssrRewriteStacktrace(e);
      } else {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  // Schema validation Error Middleware
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof Joi.ValidationError) {
      console.log("server validation error", req.originalUrl);
      return res.status(400).json({ message: error?.message, err: error?.details.map(detail => detail.message) });
    }

    return res.status(500).json({ message: "Server Validation Err", err: error });
  });

  const port = process.env.SERVER_PORT || 8080;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`\x1b[43m \x1b[30m App is listening on http://localhost:${port} with environment >> ${process.env.NODE_ENV}\x1b[0m `);
  });
}

// Start Func
(function () {
  if (process.env.NODE_ENV) {
    require("dotenv").config({
      path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)
    });
    initialiseModels()
      .then(() => createServer())
      .catch(() => createServer());
  } else {
    console.error("No NODE_ENV provided please provide an environment with your script command");
    process.exit();
  }
})();
