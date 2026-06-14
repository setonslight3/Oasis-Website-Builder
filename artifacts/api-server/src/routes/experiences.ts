import { Router, type Request, type Response } from "express";
import { db, experiencesTable, insertExperienceSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Get all experiences
router.get("/", async (req: Request, res: Response) => {
  try {
    const experiences = await db
      .select()
      .from(experiencesTable)
      .orderBy(desc(experiencesTable.createdAt));
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// Get experience by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const experience = await db
      .select()
      .from(experiencesTable)
      .where(eq(experiencesTable.id, id));
    
    if (experience.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }
    
    res.json(experience[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// Create new experience
router.post("/", async (req: Request, res: Response) => {
  try {
    const validated = insertExperienceSchema.parse(req.body);
    const [newExperience] = await db
      .insert(experiencesTable)
      .values(validated)
      .returning();
    res.status(201).json(newExperience);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create experience" });
  }
});

export default router;
