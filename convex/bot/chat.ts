import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const handleIncoming = mutation({
  args: {
    channel: v.union(v.literal("whatsapp"), v.literal("web")),
    channelId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Find or create conversation
    let conversation = await ctx.db
      .query("conversations")
      .withIndex("by_channelId", (q) =>
        q.eq("channel", args.channel).eq("channelId", args.channelId),
      )
      .unique();

    if (!conversation) {
      const conversationId = await ctx.db.insert("conversations", {
        channel: args.channel,
        channelId: args.channelId,
        phone:
          args.channel === "whatsapp" ? args.channelId : undefined,
      });
      conversation = (await ctx.db.get(conversationId))!;
    }

    // Save user message
    await ctx.db.insert("messages", {
      conversationId: conversation._id,
      role: "user",
      content: args.content,
    });

    // Schedule async processing
    await ctx.scheduler.runAfter(0, internal.bot.process.processMessage, {
      conversationId: conversation._id,
    });

    return { conversationId: conversation._id };
  },
});
