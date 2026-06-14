import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const experiencesTable = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  story: text("story").notNull(),
  tips: text("tips"),
  tags: text("tags").array().notNull().default([]),
  author: text("author").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experiencesTable).omit({ id: true, createdAt: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiencesTable.$inferSelect;
