import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3333);
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) throw new Error("Configure DATABASE_URL e JWT_SECRET no ambiente da API.");
app.listen(port, () => console.log(`AutoViva API disponível em http://localhost:${port}`));
