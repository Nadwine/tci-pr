import express, { Request, Response, NextFunction } from "express";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import path from "path";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "dist/client")));

app.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    const { render } = await vite.ssrLoadModule("/src/client/entry-server.tsx");
    const appHtml = renderToString(await render(req.originalUrl));
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vite SSR React</title>
        </head>
        <body>
          <div id="app">${appHtml}</div>
          <script type="module" src="/dist/client/assets/entry-client.js"></script>
        </body>
      </html>
    `;
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
    await vite.close();
  } catch (e: unknown) {
    next(e);
  }
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
