import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a signed upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("unauthorized");
  return await ctx.storage.generateUploadUrl();
});

// Create a new bucket list item for a Clerk user
export const createBucketListItem = mutation({
    args: v.object({
      title: v.string(),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      storageId: v.optional(v.string()),
      location: v.optional(v.string()),
      plannedDate: v.optional(v.string()),
      locationLat: v.optional(v.number()),
      locationLng: v.optional(v.number()),
      
    }),
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("unauthorized");
  
      const currentUser = await ctx.db.query("users")
        .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
        .first();
      if (!currentUser) throw new Error("User not found");
  
      const inserted = await ctx.db.insert("bucketListItems", {
        title: args.title,
        description: args.description,
        category: args.category,
        storageId: args.storageId,
        location: args.location,
        plannedDate: args.plannedDate,
        userId: currentUser._id,
        createdAt: Date.now(),
        locationLat: args.locationLat,
        locationLng: args.locationLng,
      });
  
      return inserted;
    },
  });
  

// List all bucket list items for a Clerk user
export const listBucketListItems = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return [];

    return ctx.db.query("bucketListItems")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
  },
});

// Delete a bucket list item
export const deleteBucketListItem = mutation({
  args: { itemId: v.id("bucketListItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("unauthorized");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
      .first();

    if (!user || item.userId !== user._id) {
      throw new Error("You do not have permission to delete this item");
    }

    await ctx.db.delete(args.itemId);
    return { success: true };
  },
});

export const checkBucketListItem = mutation({
    args: { itemId: v.id("bucketListItems") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("unauthorized");
  
      const item = await ctx.db.get(args.itemId);
      if (!item) throw new Error("Item not found");
  
      const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
        .first();
  
      if (!user || item.userId !== user._id) {
        throw new Error("You do not have permission to check this item");
      }
  
      await ctx.db.patch(args.itemId, {completed: !item.completed});
      return { success: true, completed: !item.completed};
    },
});

export const completedItems = query({
    args: { clerkId: v.optional(v.string())},
    handler: async (ctx, args) => {
      const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
        .first();
  
      if (!user) return [];
  
      return ctx.db.query("bucketListItems")
        .withIndex("by_user", q => q.eq("userId", user._id))
        .filter(q => q.eq(q.field("completed"), true))
        .collect();
    },
  });





