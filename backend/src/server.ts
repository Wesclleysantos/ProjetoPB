import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes";
import bebidaRoutes from "./routes/bebidaRoutes";
import consumoRoutes from "./routes/consumoRoutes";
import metaRoutes from "./routes/metaRoutes";
import progressoRoutes from "./routes/progressoRoutes";
import conquistaRoutes from "./routes/conquistaRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API Hydrates funcionando!",
  });
});

app.use(usuarioRoutes);
app.use(bebidaRoutes);
app.use(consumoRoutes);
app.use(metaRoutes);
app.use(progressoRoutes);
app.use(conquistaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});