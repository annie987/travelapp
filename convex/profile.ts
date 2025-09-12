import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return ctx.storage.getFileUrl(storageId);
  },
});

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

// Update the user's profile image

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
    if (photoUrl) updateData.image = photoUrl;  // use `image` field from schema

    return await ctx.db.patch(user._id, updateData);
  },
});


export const saveItemImage = mutation(
async (
  ctx,
  { itemId, storageId, photoUrl }: { itemId: string; storageId?: string; photoUrl?: string }
) => {
  const item = await ctx.db.get(itemId);
  if (!item) throw new Error("Item not found");

  // Only patch the fields that exist in the schema
  const updateData: Record<string, any> = {};
  if (storageId) updateData.storageId = storageId;
  if (photoUrl) updateData.photoUrl = photoUrl;

  return await ctx.db.patch(itemId, updateData);
}
);

// export const attachPhoto = mutation({
//   args: { 
//     itemId: v.id("bucketListItems"), 
//     storageId: v.id("_storage")  // Convex storage file ID
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("unauthorized");

//     const item = await ctx.db.get(args.itemId);
//     if (!item) throw new Error("Item not found");

//     const user = await ctx.db.query("users")
//       .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
//       .first();

//     if (!user || item.userId !== user._id) {
//       throw new Error("You do not have permission to update this item");
//     }

//     await ctx.db.patch(args.itemId, { storageId: args.storageId });
//     return { success: true };
//   },
// });






