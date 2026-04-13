import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("specialists").first();
    if (existing) {
      console.log("Database already seeded, skipping.");
      return;
    }

    // --- Specialists ---
    const drFrancisco = await ctx.db.insert("specialists", {
      name: "Dr. Francisco Diaz",
      specialty: "Odontologia Estetica",
      calendarId: "CALENDAR_ID_FRANCISCO", // Replace with real Google Calendar ID
    });

    const draLopez = await ctx.db.insert("specialists", {
      name: "Dra. Maria Lopez",
      specialty: "Odontologia General",
      calendarId: "CALENDAR_ID_LOPEZ", // Replace with real Google Calendar ID
    });

    const drHerrera = await ctx.db.insert("specialists", {
      name: "Dr. Andres Herrera",
      specialty: "Ortodoncia",
      calendarId: "CALENDAR_ID_HERRERA", // Replace with real Google Calendar ID
    });

    // --- Services ---
    await ctx.db.insert("services", {
      name: "Limpieza Dental",
      duration: 30,
      priceCOP: 150_000,
      priceUSD: 40,
      specialistId: draLopez,
    });

    await ctx.db.insert("services", {
      name: "Blanqueamiento",
      duration: 60,
      priceCOP: 500_000,
      priceUSD: 135,
      specialistId: drFrancisco,
    });

    await ctx.db.insert("services", {
      name: "Carillas Porcelana (x1)",
      duration: 60,
      priceCOP: 1_300_000,
      priceUSD: 350,
      specialistId: drFrancisco,
    });

    await ctx.db.insert("services", {
      name: "Diseno de Sonrisa",
      duration: 120,
      priceCOP: 8_000_000,
      priceUSD: 2_150,
      specialistId: drFrancisco,
    });

    await ctx.db.insert("services", {
      name: "Brackets Metalicos",
      duration: 45,
      priceCOP: 3_500_000,
      priceUSD: 950,
      specialistId: drHerrera,
    });

    await ctx.db.insert("services", {
      name: "Alineadores Invisibles",
      duration: 45,
      priceCOP: 6_000_000,
      priceUSD: 1_620,
      specialistId: drHerrera,
    });

    await ctx.db.insert("services", {
      name: "Endodoncia",
      duration: 90,
      priceCOP: 400_000,
      priceUSD: 110,
      specialistId: draLopez,
    });

    await ctx.db.insert("services", {
      name: "Extraccion Simple",
      duration: 30,
      priceCOP: 150_000,
      priceUSD: 40,
      specialistId: draLopez,
    });

    await ctx.db.insert("services", {
      name: "Calza Resina",
      duration: 30,
      priceCOP: 120_000,
      priceUSD: 32,
      specialistId: draLopez,
    });

    console.log("Seed complete: 3 specialists, 9 services.");
  },
});
