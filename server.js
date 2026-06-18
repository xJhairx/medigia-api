const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "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";

app.post("/preguntar", async (req, res) => {

  try {

    const pregunta = req.body.pregunta;

    console.log("Pregunta recibida:");
    console.log(pregunta);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "openai/gpt-3.5-turbo",

          messages: [

            {
              role: "system",

              content: `
Eres MediGÍA Pro.

Ayudas en:
- autismo
- TEA
- TDAH
- medicamentos
- instrucciones médicas

Responde:
- en español
- corto
- fácil de entender
- máximo 4 líneas
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

    console.log("RESPUESTA COMPLETA:");
    console.log(data);

    if (
      !data ||
      !data.choices ||
      !data.choices[0]
    ) {

      return res.json({

        respuesta:
          "La IA no devolvió respuesta."

      });

    }

    const texto =
      data.choices[0].message.content;

    console.log("TEXTO:");
    console.log(texto);

    res.json({
      respuesta: texto
    });

  } catch (error) {

    console.log("ERROR:");
    console.log(error);

    res.json({

      respuesta:
        "Error conectando con la IA."

    });

  }

});

app.listen(3000, () => {

  console.log(
    "Servidor corriendo en http://localhost:3000"
  );

});
