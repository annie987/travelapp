import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a signed upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("unauthorized");
  return await ctx.storage.generateUploadUrl();
});

// Get profile image
export const getProfileImage = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) return null;

    return {
      image: user.image,
      storageId: user.storageId,
    };
  },
});

// ✅ Update profile image mutation
export const updateProfileImage = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Get permanent Convex URL
    const imageUrl = await ctx.storage.getUrl(storageId);
    if (!imageUrl) throw new Error("Could not get image URL from storage");

    await ctx.db.patch(user._id, {
      storageId,
      image: imageUrl,
    });

    console.log("Profile updated with:", imageUrl);
    return imageUrl; // ✅ return permanent URL
  },
});

// ✅ Save item image mutation
export const saveItemImage = mutation({
  args: {
    itemId: v.id("bucketListItems"),
    storageId: v.string(),
  },
  handler: async (ctx, { itemId, storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");

    const item = await ctx.db.get(itemId);
    if (!item) throw new Error("Item not found");

    // Get permanent Convex URL
    const permanentUrl = await ctx.storage.getUrl(storageId);
    if (!permanentUrl) {
      throw new Error("Could not get image URL from storage");
    }

    await ctx.db.patch(itemId, {
      storageId,
      photoUrl: permanentUrl,
    });

    console.log("Item image updated with:", permanentUrl);
    return permanentUrl; // ✅ return permanent URL
  },
});
