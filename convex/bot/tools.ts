// Bot function calling tools for Gemini via Vercel AI SDK
// These will be wired into generateText({ tools }) when AI SDK is configured

import { v } from "convex/values";
import { internalQuery, internalMutation } from "../_generated/server";

// --- Tool implementations (Convex queries/mutations) ---

export const lookupPatient = internalQuery({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("patients")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .unique();
  },
});

export const listServices = internalQuery({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    const specialists = await ctx.db.query("specialists").collect();

    return services.map((service) => {
      const specialist = specialists.find(
        (s) => s._id === service.specialistId,
      );
      return {
        id: service._id,
        name: service.name,
        duration: service.duration,
        priceCOP: service.priceCOP,
        priceUSD: service.priceUSD,
        specialist: specialist?.name ?? "N/A",
        specialty: specialist?.specialty ?? "N/A",
      };
    });
  },
});

export const getAppointmentsByPatient = internalQuery({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("appointments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

export const createPatient = internalMutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    cedula: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("patients", args);
  },
});

export const createAppointment = internalMutation({
  args: {
    patientId: v.id("patients"),
    serviceId: v.id("services"),
    specialistId: v.id("specialists"),
    datetime: v.string(),
    calendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("appointments", {
      ...args,
      status: "confirmed",
    });
  },
});

export const cancelAppointment = internalMutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    await ctx.db.patch(args.appointmentId, { status: "cancelled" });
    return appointment;
  },
});

export const rescheduleAppointment = internalMutation({
  args: {
    appointmentId: v.id("appointments"),
    newDatetime: v.string(),
    newCalendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    await ctx.db.patch(args.appointmentId, {
      datetime: args.newDatetime,
      status: "confirmed",
      calendarEventId: args.newCalendarEventId ?? appointment.calendarEventId,
    });
    return { ...appointment, datetime: args.newDatetime };
  },
});

export const updatePatientInfo = internalMutation({
  args: {
    patientId: v.id("patients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    cedula: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { patientId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined),
    );
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(patientId, filtered);
    }
    return ctx.db.get(patientId);
  },
});
