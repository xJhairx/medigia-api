const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// API KEY NUEVA DE OPENROUTER
const API_KEY = "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";

app.post("/preguntar", async (req, res) => {
  try {
    const pregunta = req.body.pregunta;

    console.log("Pregunta:", pregunta);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://medigia.netlify.app",
          "X-Title": "MediGIA"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: `
Eres MediGÍA Pro.

Especialista en:
- Autismo
- TEA
- TDAH
- Medicamentos
- Instrucciones médicas

Reglas:
- Responde siempre en español
- Respuestas cortas
- Fácil de entender
- Máximo 4 líneas
- Si no sabes algo, indica consultar al médico
`
            },
            {
              role: "user",
              content: pregunta
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return res.json({
        respuesta:
          data.error?.message ||
          "Error al consultar la IA"
      });
    }

    const respuesta =
      data.choices?.[0]?.message?.content ||
      "No pude responder eso.";

    res.json({
      respuesta
    });

  } catch (error) {
    console.error(error);

    res.json({
      respuesta: "Error conectando con la IA."
    });
  }
});

// Ruta para probar que Render funciona
app.get("/", (req, res) => {
  res.send("Servidor MediGIA funcionando");
});

// IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
