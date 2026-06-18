const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// PON AQUÍ TU NUEVA API KEY
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `
Eres MediGÍA Pro.

Tu especialidad es:
- Autismo (TEA)
- TDAH
- Medicamentos
- Instrucciones médicas
- Accesibilidad

Responde:
- En español
- Fácil de entender
- Máximo 4 líneas
- Sin lenguaje complicado

Si la pregunta no es médica, igualmente responde de forma amable.
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

    console.log("RESPUESTA OPENROUTER:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.json({
        respuesta:
          data?.error?.message ||
          "Error al consultar la IA."
      });
    }

    const respuesta =
      data?.choices?.[0]?.message?.content ||
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MediGIA funcionando en puerto ${PORT}`);
});
