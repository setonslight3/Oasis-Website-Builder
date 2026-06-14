import { db, experiencesTable, flaggedTable } from "@workspace/db";
import experiencesData from "../../artifacts/synapse/src/data/experiences.json";
import flaggedData from "../../artifacts/synapse/src/data/flagged.json";

async function seed() {
  console.log("Seeding database...");
  
  // Seed experiences
  for (const exp of experiencesData) {
    await db.insert(experiencesTable).values({
      title: exp.title,
      category: exp.category,
      summary: exp.summary,
      story: exp.story,
      tips: exp.tips,
      tags: exp.tags,
      author: exp.author,
      date: new Date(exp.date),
      location: exp.location,
    });
  }
  
  // Seed flagged reports
  for (const flag of flaggedData) {
    await db.insert(flaggedTable).values({
      type: flag.type,
      target: flag.target,
      risk: flag.risk,
      confidence: flag.confidence,
      reports: flag.reports,
      description: flag.description,
      category: flag.category,
      date: new Date(flag.date),
    });
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
