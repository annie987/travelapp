import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    fullname: v.optional(v.string()),
    image: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing record with the latest Clerk values
      await ctx.db.patch(existingUser._id, {
        fullname: args.fullname ?? existingUser.fullname,
        email: args.email ?? existingUser.email,
        image: args.image ?? existingUser.image,
        username: args.username ?? existingUser.username,
      });
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      fullname: args.fullname ?? "",
      email: args.email ?? "",
      image: args.image ?? "",
      username: args.username ?? "",
    });
  },
});


export const saveAvatar = mutation(
  async (ctx, { storageId, photoUrl }: { storageId: string; photoUrl?: string }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("unauthorized");

    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Update the user's avatar in the users table
    return await ctx.db.patch(user._id, { storageId, image: photoUrl });
  }
);
