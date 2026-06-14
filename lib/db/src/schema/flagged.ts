import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flaggedTable = pgTable("flagged", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'phone', 'account', 'website'
  target: text("target").notNull(),
  risk: text("risk").notNull(), // 'High', 'Medium', 'Low'
  confidence: integer("confidence").notNull(),
  reports: integer("reports").notNull().default(1),
  description: text("description").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFlaggedSchema = createInsertSchema(flaggedTable).omit({ id: true, createdAt: true });
export type InsertFlagged = z.infer<typeof insertFlaggedSchema>;
export type Flagged = typeof flaggedTable.$inferSelect;
