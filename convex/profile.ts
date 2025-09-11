import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Fetch the user's profile image
export const getProfileImage = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first();
    
    if (!user || !user.image) return null; // <-- use `image` field

    return { photoUrl: user.image, storageId: user.storageId }; // return both
  },
});


// // Update the user's profile image

export const updateProfileImage = mutation({
  args: { storageId: v.optional(v.string()), photoUrl: v.optional(v.string()) },
  handler: async (ctx, { storageId, photoUrl }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");

    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
      .first();
    
    if (!user) throw new Error("User not found");

    const updateData: Record<string, any> = {};
    if (storageId) updateData.storageId = storageId;
    if (photoUrl) updateData.photoUrl = photoUrl;  // use `image` field from schema

    return await ctx.db.patch(user._id, updateData);
  },
});






