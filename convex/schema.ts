import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  specialists: defineTable({
    name: v.string(),
    specialty: v.string(),
    calendarId: v.string(),
  }),

  services: defineTable({
    name: v.string(),
    duration: v.number(), // minutes
    priceCOP: v.number(),
    priceUSD: v.number(),
    specialistId: v.id("specialists"),
  }).index("by_specialist", ["specialistId"]),

  patients: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    cedula: v.string(),
  }).index("by_phone", ["phone"]),

  appointments: defineTable({
    patientId: v.id("patients"),
    serviceId: v.id("services"),
    specialistId: v.id("specialists"),
    datetime: v.string(), // ISO 8601
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("rescheduled"),
      v.literal("completed"),
    ),
    calendarEventId: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_specialist", ["specialistId"])
    .index("by_status", ["status"]),

  conversations: defineTable({
    channel: v.union(v.literal("whatsapp"), v.literal("web")),
    channelId: v.string(), // phone number or session ID
    phone: v.optional(v.string()), // unified identifier
    language: v.optional(v.string()),
  }).index("by_channelId", ["channel", "channelId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
  }).index("by_conversation", ["conversationId"]),
});
