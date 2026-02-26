import * as express from "EXPRESS";
import { correlationId } from "./middleware/correlationId";
import { sanitizeBody } from "./middleware/sanitize";
import { authRequired } from "./middleware/auth";
import { createGestionUsuariosRouter } from "./routes/gestionUsuarios.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { InMemoryUserRepository } from "./infra/repositories/InMemoryUserRepository";
import { GestionUsuarios } from "./domain/services/GestionUsuarios";

const app = express();
app.use(express.json());
app.use(correlationId);
app.use(sanitizeBody);

const userRepository = new InMemoryUserRepository();
const gestionUsuarios = new GestionUsuarios(userRepository);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/v1", authRequired);
app.use("/api/v1", createGestionUsuariosRouter(gestionUsuarios));

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
 
  console.log(`API listening on http://localhost:${port}`);
});
