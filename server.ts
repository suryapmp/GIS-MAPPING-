import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "HYDRO-GIS Research Platform", version: "1.0.0" });
  });

  // AI Hydrogeological Research Assistant
  app.post("/api/ai/analyze-hydro", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in backend environment." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are HYDRO-GIS AI, a senior PhD Hydrogeologist and Groundwater Decision Support Assistant.
You provide precise scientific interpretations regarding aquifer recharge potential, AHP consistency ratios, ERT resistivity profiles, Managed Aquifer Recharge (MAR) site selections, and machine learning feature importance for hydrogeology.
Keep explanations rigorous, quantitative, and directly referenced to hydrogeological terminology (e.g. saprolite layer, hard-rock fracture networks, transmissivity, specific yield, recharge efficiency).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemInstruction}\n\nContext Data:\n${JSON.stringify(context || {})}\n\nUser Question/Prompt:\n${prompt}` }
            ]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI hydrogeology response." });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HYDRO-GIS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
