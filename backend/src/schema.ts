import { text, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const shortenedUrls = mysqlTable("shortened_urls", {
  id: varchar("id", { length: 6 }).primaryKey(),
  target: text("target").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
