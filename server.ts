import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Puzzle Logic ---

function getInversionCount(arr: number[]): number {
  let invCount = 0;
  const flat = arr.filter(x => x !== 0);
  for (let i = 0; i < flat.length - 1; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) invCount++;
    }
  }
  return invCount;
}

function isSolvable(puzzle: number[], rows: number, cols: number): boolean {
  const invCount = getInversionCount(puzzle);
  
  if (cols % 2 !== 0) {
    // Odd width: solvable if inversions is even
    return invCount % 2 === 0;
  } else {
    // Even width: 
    // find blank row from bottom
    const emptyIdx = puzzle.indexOf(0);
    const rowFromBottom = rows - Math.floor(emptyIdx / cols);
    if (rowFromBottom % 2 === 0) {
      // blank on even row from bottom: invCount must be odd
      return invCount % 2 !== 0;
    } else {
      // blank on odd row from bottom: invCount must be even
      return invCount % 2 === 0;
    }
  }
}

function generateRandomPuzzle(rows: number, cols: number): number[] {
  const size = rows * cols;
  let puzzle: number[];
  do {
    puzzle = Array.from({ length: size }, (_, i) => i).sort(() => Math.random() - 0.5);
  } while (!isSolvable(puzzle, rows, cols));
  return puzzle;
}

// --- Swagger Setup ---

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GridShift Solver API",
      version: "1.0.0",
      description: "API for generating puzzles and managing solver data",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/generatePuzzle:
 *   post:
 *     summary: Generate a random solvable puzzle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rows:
 *                 type: integer
 *                 default: 3
 *               cols:
 *                 type: integer
 *                 default: 3
 *     responses:
 *       200:
 *         description: A valid puzzle state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 puzzle:
 *                   type: array
 *                   items:
 *                     type: integer
 */
app.post("/api/generatePuzzle", (req, res) => {
  const { rows = 3, cols = 3 } = req.body;
  const puzzle = generateRandomPuzzle(rows, cols);
  res.json({ puzzle });
});

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
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
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

startServer();
