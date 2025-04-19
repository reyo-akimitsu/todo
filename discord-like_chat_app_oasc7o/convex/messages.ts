import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("messages", {
      channelId: args.channelId,
      authorId: userId,
      content: args.content,
    });
  },
});

export const list = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", q => q.eq("channelId", args.channelId))
      .order("desc")
      .collect();

    return Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          author: author?.name ?? "Unknown",
        };
      })
    );
  },
});
