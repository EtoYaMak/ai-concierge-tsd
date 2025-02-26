import { createApp } from "../server/index";

let app;

export default async function handler(req, res) {
  if (!app) {
    const { app: expressApp } = await createApp();
    app = expressApp;
  }

  // Let the Express app handle the request
  return app(req, res);
}
