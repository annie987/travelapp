import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users:defineTable({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        image: v.string(),
        clerkId: v.string(),
        storageId: v.optional(v.string()), 
    }).index("by_clerk_id", ["clerkId"]),

    bucketListItems:defineTable({
        userId:v.id("users"),
        title: v.string(),               // e.g., "See the Northern Lights"
        description: v.optional(v.string()),
        location: v.optional(v.string()),  
        plannedDate: v.optional(v.string()), // Format: YYYY-MM-DD
        category: v.optional(v.string()), // e.g., "Adventure", "Cultural"
        storageId: v.optional(v.string()),
        createdAt: v.optional(v.number()),
        completed: v.optional(v.boolean()),
        locationLat: v.optional(v.number()),
        locationLng: v.optional(v.number()),
        photoUrl: v.optional(v.string()),
    }).index("by_user", ["userId"]),

});
  