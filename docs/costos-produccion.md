# Costos de Produccion — Axia Bot

> Proyeccion de costos a escala para el ecosistema digital de Axia Odontologia.
> Precios verificados en abril 2026.

---

## Resumen ejecutivo

| Servicio | Costo mensual (escenario base) | Costo mensual (escala alta) |
|---|---|---|
| Convex | $0 (free tier) | $25+ (Pro) |
| Gemini 2.5 Flash | ~$1.50 | ~$15 |
| Twilio WhatsApp | ~$15 | ~$150 |
| Google Calendar API | $0 | $0 |
| Cloudflare Workers | $0 (free tier) | $5-8 |
| Vercel | $20 (Pro) | $20+ |
| **Total estimado** | **~$36.50/mes** | **~$223+/mes** |

**Escenario base:** 500 conversaciones/mes, 10 mensajes promedio por conversacion.
**Escala alta:** 5,000 conversaciones/mes, 10 mensajes promedio por conversacion.

---

## 1. Convex

Backend reactivo (DB + serverless functions).

| Recurso | Free / Starter | Pro ($25/dev/mes) |
|---|---|---|
| Function calls | 1M / mes | 25M / mes |
| Action compute | 20 GB-horas / mes | 250 GB-horas / mes |
| Database storage | 0.5 GB | 50 GB |
| File storage | 1 GB | 100 GB |
| Database I/O | 1 GB / mes | 50 GB / mes |
| Concurrent sessions | 1,000 | 10,000 |

**Overage (Pro):** $2.00 / 1M function calls, $0.30 / GB-hr compute.

### Proyeccion

- **Escenario base (500 conv/mes):** ~5,000 function calls + ~5,000 actions = bien dentro del free tier.
- **Escala alta (5,000 conv/mes):** ~50,000 function calls + ~50,000 actions = aun dentro del free tier. Pro se necesita por concurrent sessions si hay muchos usuarios simultaneos.

**Nota:** Precios cambian a partir del 6 de mayo 2026. Verificar en convex.dev/pricing.

---

## 2. Gemini 2.5 Flash API

LLM para el chatbot conversacional.

| Tier | Input (texto) | Output |
|---|---|---|
| Free | Gratis (rate limited) | Gratis |
| Standard | $0.30 / 1M tokens | $2.50 / 1M tokens |
| Batch | $0.15 / 1M tokens | $1.25 / 1M tokens |

### Proyeccion

Asumiendo por conversacion:
- System prompt: ~1,500 tokens (input fijo)
- 10 mensajes del usuario: ~500 tokens input
- 10 respuestas del bot: ~1,000 tokens output
- Function calling overhead: ~500 tokens input, ~300 tokens output
- **Total por conversacion:** ~2,500 tokens input, ~1,300 tokens output

| Escenario | Conversaciones | Input tokens | Output tokens | Costo |
|---|---|---|---|---|
| Base | 500/mes | 1.25M | 650K | ~$2.00 |
| Alta | 5,000/mes | 12.5M | 6.5M | ~$20.00 |

**Context caching** puede reducir costos ~50% para el system prompt ($0.03/1M tokens cache hit vs $0.30/1M normal).

---

## 3. Twilio WhatsApp Business API

Desde julio 2025, Meta cobra por mensaje template; mensajes de sesion (dentro de 24h) son gratis excepto el markup de Twilio.

| Tipo de mensaje | Costo Meta (Colombia) | Markup Twilio | Total |
|---|---|---|---|
| Sesion (24h window) | $0 | $0.005 | $0.005 |
| Utility template | ~$0.0034 | $0.005 | ~$0.008 |
| Marketing template | ~$0.035 | $0.005 | ~$0.040 |

### Proyeccion

Flujo tipico: paciente inicia conversacion (sesion), bot responde dentro de 24h (sesion). Solo se usan templates para confirmaciones/recordatorios proactivos.

| Escenario | Mensajes sesion | Templates utility | Costo |
|---|---|---|---|
| Base (500 conv) | 5,000 inbound + 5,000 outbound = 10,000 | 500 confirmaciones | ~$54 |
| Alta (5,000 conv) | 100,000 | 5,000 confirmaciones | ~$540 |

**Nota:** Twilio cobra $0.005 por CADA mensaje (inbound + outbound). Es el costo dominante a escala.

---

## 4. Google Calendar API

| Recurso | Limite |
|---|---|
| Costo | **Gratis** |
| Queries por dia | 1,000,000 |
| Queries por minuto (proyecto) | Configurable en Cloud Console |

**Costo: $0.** No hay cobro por uso. Solo rate limits que se pueden aumentar gratis.

---

## 5. Cloudflare Workers

API del bot (Hono).

| | Free | Paid ($5/mes base) |
|---|---|---|
| Requests | 100,000 / dia | 10M / mes; luego $0.30/1M |
| CPU time | 10ms max | 30s max; 30M CPU-ms incluidos |
| Egress | Gratis | Gratis |

### Proyeccion

- **Escenario base:** 500 webhooks/mes + health checks = bien dentro del free tier.
- **Escala alta:** 5,000 webhooks/mes = aun dentro del free tier (100K/dia >> 5K/mes).
- **Plan paid** solo se necesita si el procesamiento del webhook toma >10ms de CPU (probable con validacion de firma de Twilio).

---

## 6. Vercel

Hosting del landing (y futuro portal).

| | Hobby (Gratis) | Pro ($20/user/mes) |
|---|---|---|
| Edge requests | 1M / mes | 10M / mes |
| Data transfer | 100 GB / mes | 1 TB / mes |
| Function invocations | 1M / mes | 1M / mes |
| Uso comercial | No | Si |

**Hobby no permite uso comercial** — Axia necesita Pro desde el dia 1.

### Proyeccion

- **Landing estatico con SSR:** trafico bajo-medio, bien dentro de los limites de Pro.
- **Costo fijo:** $20/mes.

---

## Factores de escala criticos

### 1. Twilio es el costo dominante
A $0.005/mensaje (ambas direcciones), una conversacion de 10 mensajes = $0.10 solo en markup de Twilio. A 5,000 conversaciones/mes = $500+. Considerar:
- **Reducir mensajes por conversacion** — respuestas mas concisas, menos back-and-forth
- **Migrar a WhatsApp Business API directo** (sin Twilio) — elimina el markup de $0.005/msg
- **360dialog o MessageBird** como alternativas con pricing diferente

### 2. Gemini es muy barato
A $0.30/1M input + $2.50/1M output, el LLM es uno de los costos mas bajos. Context caching puede reducirlo aun mas.

### 3. Convex free tier es generoso
1M function calls/mes cubre facilmente miles de conversaciones. Pro solo se necesita por concurrent sessions o storage.

### 4. Infraestructura fija
Vercel Pro ($20) + CF Workers Paid ($5) = $25/mes fijo. No escala con uso hasta volumenes muy altos.

---

## Costo por conversacion

| Componente | Costo / conversacion (10 msgs) |
|---|---|
| Twilio (inbound + outbound) | $0.10 |
| Gemini (input + output) | $0.004 |
| Convex | ~$0.001 |
| CF Workers | ~$0.0001 |
| **Total variable** | **~$0.105** |

**Costo fijo mensual:** ~$25-45 (Vercel + CF Workers + Convex si Pro).

---

## Fuentes

- Convex: convex.dev/pricing (verificar post mayo 2026)
- Gemini: ai.google.dev/gemini-api/docs/pricing
- Twilio: twilio.com/en-us/whatsapp/pricing
- Google Calendar: developers.google.com/workspace/calendar/api/guides/quota
- Cloudflare Workers: developers.cloudflare.com/workers/platform/pricing
- Vercel: vercel.com/pricing
