import { Router, type Request, type Response } from "express";
import { db, flaggedTable, insertFlaggedSchema } from "@workspace/db";
import { eq, desc, or, like } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Get all flagged reports
router.get("/", async (req: Request, res: Response) => {
  try {
    const reports = await db
      .select()
      .from(flaggedTable)
      .orderBy(desc(flaggedTable.createdAt));
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flagged reports" });
  }
});

// Search flagged reports
router.get("/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    
    const cleanedQuery = q.toLowerCase().replace(/[\s\-\().+]/g, '');
    const reports = await db
      .select()
      .from(flaggedTable)
      .where(
        or(
          like(flaggedTable.target, `%${q}%`),
          like(flaggedTable.target, `%${cleanedQuery}%`)
        )
      );
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to search flagged reports" });
  }
});

// Get flagged report by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const report = await db
      .select()
      .from(flaggedTable)
      .where(eq(flaggedTable.id, id));
    
    if (report.length === 0) {
      return res.status(404).json({ error: "Flagged report not found" });
    }
    
    res.json(report[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flagged report" });
  }
});

// Create new flagged report
router.post("/", async (req: Request, res: Response) => {
  try {
    const validated = insertFlaggedSchema.parse(req.body);
    const [newReport] = await db
      .insert(flaggedTable)
      .values(validated)
      .returning();
    res.status(201).json(newReport);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create flagged report" });
  }
});

export default router;
