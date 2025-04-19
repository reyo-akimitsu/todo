import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  channels: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),
  messages: defineTable({
    channelId: v.id("channels"),
    authorId: v.id("users"),
    content: v.string(),
  }).index("by_channel", ["channelId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
