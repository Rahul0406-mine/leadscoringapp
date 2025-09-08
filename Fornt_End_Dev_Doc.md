Great — below is a clear, **actionable, step-by-step build plan** for the Agent Outreach AI product, aligned to your three authoritative documents and resolving any conflicts in favour of the backend/operational report. I’ve assumed **GCP** as your cloud provider (per your latest message) and kept the UI/UX, API and product requirements exactly as in your files. Where the documents are relevant I cite them so you can cross-check quickly.

---

# **1 — High level architecture (recommended, GCP)**

**Core idea:** small number of managed services to minimize ops burden while supporting the Redis worker \+ LLM adapter described in the backend doc.

* Frontend: React \+ TypeScript \+ Vite, Tailwind (tokens from UI doc), shadcn/ui components. Use React Flow for canvas/flow builder.

* Backend API: FastAPI (async) or Node/Express with TypeScript. (Operational doc suggested FastAPI skeleton as an option.)

* LLM adapter: pluggable async adapter that supports OpenAI (primary) and Anthropic (fallback) (log tokens \+ cost).

* Worker queue: Redis (Dramatiq / Celery / RQ) for asynchronous LLM calls, webhook retries, scheduled flows.

* DB: Cloud SQL (Postgres).

* Redis: Memorystore (managed Redis).

* Messaging: Twilio for SMS/WhatsApp/Voice (inbound \+ outbound). Track WhatsApp template approval state and block until `approved`.

* Analytics: Metabase connected to Postgres (self-hosted / Cloud Run).

* CI/CD: Cloud Build or GitHub Actions → deploy to Cloud Run (services) and Cloud Run Jobs for workers (or Cloud Run \+ managed Redis worker).

* Storage: GCS for uploaded KB files and call recordings.

* Secrets: Secret Manager (GCP).

* Monitoring: Cloud Logging \+ optional Sentry (you can provide DSN).

---

# **2 — Phased, step-by-step build plan (ordered — do not skip)**

Each phase lists concrete dev tasks, frontend tasks, and acceptance criteria. I leave out time estimates (per your instruction).

---

## **Phase 0 — Repo \+ project scaffolding (setup)**

**Backend doc source:** preflight & scaffolding.

**Tasks**

1. Create GitHub repo, branch strategy (main / dev / feature).

2. Initialize monorepo (recommended) or two repos: `frontend/` \+ `backend/`.

3. Add basic `README`, `CONTRIBUTING`, `.gitignore`, and `CODEOWNERS`.

4. Add `docker-compose.yml` for local dev: API \+ worker \+ Postgres \+ Redis \+ MinIO (or GCS emulator). (Operational doc suggested a Docker+FastAPI skeleton as a starter.)

5. CI pipeline: basic linters, typecheck, unit tests.

**Acceptance**

* `docker-compose up` boots API, worker, Postgres and Redis locally and `GET /health` returns `200 OK`.

---

## **Phase 1 — Data model, migrations & auth**

**Source:** PRD data model \+ API snippets.

**Backend tasks**

1. Implement DB schema (users, agents, campaigns, leads, messages, llm\_requests, webhook\_logs, metrics\_daily). Use Alembic (or equivalent) for migrations.

2. Implement JWT-based auth \+ admin role (single-user mode initially acceptable).

3. Implement base CRUD endpoints for Agents & Leads (follow the API list in the UI doc).

**Frontend tasks**

1. Create design token system (Tailwind config) per the UI doc tokens (colors, spacing, typography).

2. Implement basic layout (sidebar, topbar) and a skeleton for `AI Agents` tab.

**Acceptance**

* Migrations run; API can create/list/get/update/delete agents and leads. Frontend can fetch and display agent list (mock data ok).

---

## **Phase 2 — LLM adapter \+ test console**

**Source:** adapter contract & test console in operational doc.

**Backend tasks**

1. Build `llm_adapter` module with provider registry (OpenAI \+ Anthropic). Implement async HTTP calls, token counting, latency measurement and cost estimator. Log each call to `llm_requests`.

2. Add circuit-breaker and provider failover logic (if primary fails use secondary).

3. Implement `POST /api/agents/{id}/test` (returns response \+ latency \+ token counts).

**Frontend tasks**

1. Build Agent Test Console UI (inline drawer) following UI doc microcopy and test result display.

**Acceptance**

* Test console returns realistic LLM responses; `llm_requests` rows are created with tokens/latency.

---

## **Phase 3 — Queue, worker & LLM jobs**

**Source:** worker \+ queue in operational doc.

**Backend tasks**

1. Deploy Redis (Memorystore) and worker process (Dramatiq/Celery).

2. Offload heavy LLM calls to worker jobs; worker writes `llm_requests` and returns results via DB or message bus.

3. Implement webhook retry worker (2 retries \+ alert).

**Acceptance**

* Worker processes a sample job (LLM request) end-to-end; webhook retry logic triggers retries and logs failures.

---

## **Phase 4 — Twilio integration (SMS / WhatsApp / Voice)**

**Source:** Twilio / WhatsApp handling in operational doc & PRD.

**Backend tasks**

1. Implement inbound webhook endpoint `POST /api/webhooks/receive` — normalize Twilio payloads to an internal message format.

2. Outbound send service (Twilio SDK): SMS, WhatsApp templates (block until status \= `approved`), start TTS voice calls.

3. Store message records (direction, provider id, status).

4. Implement opt-out/consent checks (TCPA).

**Frontend tasks**

1. Inbox UI (3 tabs: SMS / WhatsApp / Email) basic listing \+ message pane per the UI doc design.

2. Composer with channel selection \+ template picker (templates can be Draft/Submitted/Approved).

**Acceptance**

* Inbound Twilio webhook stored as message; outbound send returns Twilio SID and message logged. WhatsApp send blocked if template not `approved`.

---

## **Phase 5 — Flow runner & Campaigns**

**Source:** Flow builder spec & campaign validation.

**Backend tasks**

1. Campaign model that stores flow JSON (export/import supported).

2. Flow engine (worker-driven) that executes steps: send → wait → branch → call webhook / agent. Use Redis jobs \+ state machine.

3. Validation API `POST /api/campaigns/{id}/validate` (static checks: missing agent, unapproved templates, circular loops).

**Frontend tasks**

1. Integrate React Flow for canvas editor. Implement inspector panel (node config) and agent-select modal.

2. Save / Load flow JSON and show validation errors inline.

**Acceptance**

* Create a sample campaign with 3 steps and run it: messages \+ follow-up recorded, branching executed correctly.

---

## **Phase 6 — Agents library \+ KB management \+ webhooks**

**Source:** Agent features & KB upload in UI doc \+ PRD.

**Backend tasks**

1. Agent CRUD with prompt, tone, model config, KB refs (GCS links), webhook configs (encrypted tokens), runtime limits.

2. KB parser background job (text extraction from PDFs, indexing). Keep placeholders seeded if KB not provided.

3. Webhook invocation and response mapping logging.

**Frontend tasks**

1. Agent create/edit drawer as specified (sections: General, Prompt, Model, KB, Webhooks, Voice).

2. Show agent analytics: avg latency, p95, cost estimates.

**Acceptance**

* Agent created, KB uploaded (or placeholder), webhook fires and logs results. Agent appears in Agent Library with metrics.

---

## **Phase 7 — Inbox enhancements & Gmail sync (optional MVP)**

**Source:** Inbox & Gmail in UI doc / PRD. Gmail sync is optional for MVP unless you provide Gmail creds.

**Backend tasks**

1. If Gmail included: implement OAuth, thread mapping, send via linked account.

2. Voice transcripts: store and display transcripts \+ play audio.

**Frontend**

1. Inbox filters, assignment, opt-out banners, composer template enforcement.

**Acceptance**

* Email threads show in Email tab; composer can send via Gmail when linked.

---

## **Phase 8 — Analytics & dashboards**

**Source:** Metabase & metrics in operational doc.

**Tasks**

1. Create metrics table aggregations (daily messages, avg latency, p95) and functions populating metrics\_daily.

2. Deploy Metabase and create dashboards: Campaign Analytics \+ Agent Analytics (cards \+ time-series \+ agents table).

**Acceptance**

* Dashboards show realistic data and can export CSV/PDF.

---

## **Phase 9 — QA, security, runbook & launch prep**

**Tasks**

1. End-to-end tests: Twilio inbound/outbound flows, agent test console, campaign run.

2. Security: encrypt webhook tokens, use Secret Manager, TLS, review role-based access.

3. Backups & retention policies (30-day message retention as per PRD).

4. Ops runbook: on-call, alerts (webhook failures, LLM provider outage, cost spikes).

**Acceptance**

* Test scenarios pass; critical alerts configured; backups tested.

---

# **3 — Frontend implementation checklist & priorities**

**Stack & libraries**

* React \+ TypeScript \+ Vite

* Tailwind (map tokens from UI doc), shadcn/ui, lucide-react icons.

* React Query or SWR for data fetching.

* React Flow for canvas; react-virtualized or TanStack Table for large lists.

**Must-build components (in priority order)**

1. App shell \+ global layout (sidebar/topbar).

2. Agent Library list \+ detail drawer \+ Test Console.

3. Inbox list \+ message pane \+ composer \+ template picker.

4. Flow Builder canvas \+ inspector \+ node palette.

5. Campaign editor \+ validation UI.

6. Analytics pages (cards \+ tables \+ CSV export).

**Accessibility**

* Follow the a11y checklist (keyboard reachable controls, aria-labels, color contrast) from the UI doc.

---

# **4 — Things *you* must provide (copy/paste checklist)**

Per the backend doc and your confirmations (you said you will provide credentials). Provide these before we deploy production infra:

1. GCP project \+ owner access (or a service account with appropriate permissions). (You chose GCP).

2. Twilio Account SID & Auth Token \+ phone numbers (E.164).

3. LLM provider keys: OpenAI API key (and Anthropic if you want fallback).

4. GitHub repo access or tell me where to push code.

5. App domain and DNS access for TLS.

6. WhatsApp templates — you said you don’t have them; I’ll provide starter templates below. (We’ll store them and track approval state.).

7. Knowledge-base files for agents — you asked placeholders; we’ll seed placeholders until you upload.

8. Sample leads CSV (sanitized) — you said ok to provide.

9. (Optional) Sentry DSN, Metabase admin, and observability credentials.

---

# **5 — Starter templates (I created these for you — you can edit or submit them)**

WhatsApp templates must be submitted for Meta approval — their structure must be exact (title, language, body \+ placeholders). These templates are crafted to be generic for real estate outreach. Save them as separate files and we’ll store status: Draft → Submitted → Approved.

### **WhatsApp — Template A: `appointment_reminder_en_us` (Business-initiated)**

Title: appointment\_reminder\_en\_us  
Language: en\_US  
Body:  
Hi {{1}}, this is {{2}} from {{3}}. A reminder for your appointment at {{4}} on {{5}} at {{6}}. Reply YES to confirm or CALL to speak with us.

### **WhatsApp — Template B: `lead_followup_en_us`**

Title: lead\_followup\_en\_us  
Language: en\_US  
Body:  
Hi {{1}}, thanks for your interest in {{2}}. Are you available this week for a quick 10-min call? Reply with a preferred day/time and we’ll confirm.

### **WhatsApp — Template C: `open_house_invite_en_us`**

Title: open\_house\_invite\_en\_us  
Language: en\_US  
Body:  
Hi {{1}}, join us at an Open House for {{2}} on {{3}} from {{4}}–{{5}}. Reply YES to RSVP and we’ll send directions.

### **SMS — Template examples (short \+ \<160 chars)**

* `sms_followup_1`: "Hi {{name}}, it's {{agent}}. Quick check — are you still interested in {{property\_address}}? Reply YES to connect."

* `sms_lead_fast`: "Hi {{name}} — we’ve got new listings that match your needs. Interested? Reply SHOW."

### **Voice TTS — Scripts (outbound calls)**

* `voice_appointment_confirm`: "Hello {{name}}. This is {{agent}} from {{brokerage}} calling to confirm your showing for {{property\_address}} on {{date}} at {{time}}. Press 1 to confirm, 2 to reschedule."

* `voice_followup`: "Hi {{name}}, following up on your interest in {{property}}. Call us back at {{callback\_number}} to speak with an agent."

(We will store template metadata with placeholders and channel and enforce `approved` for WhatsApp templates.)

---

# **6 — Minimal API surface & env var names (developer handy list)**

**Important endpoints (implement early)**

* `GET /api/agents` — list (filters: status,q).

* `POST /api/agents` — create (name,type,prompt,modelConfig,kbRefs,webhookConfigs).

* `POST /api/agents/{id}/test` — run test prompt.

* `POST /api/webhooks/receive` — unified inbound receiver (Twilio, Salesforce).

* `POST /api/campaigns/{id}/validate` — static validation.

**Key env vars**

* `DATABASE_URL`, `REDIS_URL`, `GCS_BUCKET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (optional), `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`, `SECRET_MANAGER_KEY`.

---

# **7 — Testing & QA checklist (must pass before launch)**

* Unit tests for adapters (LLM adapter, Twilio adapter).

* Integration tests for webhook receiver (simulate Twilio POSTs).

* E2E campaign run (sample 3-step campaign).

* Security scan (secrets not in repo; TLS enforced).

---

# **8 — Ops & runbook (minimum)**

* On-call flows for LLM provider outage (switch to fallback provider).

* Webhook failures: retry policy (2 retries) \+ alert to Slack/admin.

* Cost monitoring: track `llm_requests` tokens & cost estimates daily; set budget alerts.

---

# **9 — Deliverables I can produce next (choose any; I will generate immediately)**

You already said you will provide credentials. While you gather them, I can produce any of these artifacts instantly in this chat — tell me which you want **now** (I’ll generate them immediately):

* OpenAPI (Swagger) spec for the API list above.

* Docker Compose \+ FastAPI starter skeleton (backend \+ worker \+ Postgres \+ Redis) for local dev.

* Terraform starter for GCP (Cloud Run, Cloud SQL, Memorystore, GCS) — adapted from the DO terraform suggestion in the backend doc.

* Postman collection with sample Twilio webhook payloads and API calls.

Pick any combination (e.g., “OpenAPI \+ Docker Compose \+ Terraform for GCP”) and I’ll produce them now.

---

# **10 — Final notes & confirmations**

* I followed the UI/UX token & component guidance for frontend choices.

* All platform choices and sequencing favor the Operational / Build Report where conflicts existed.

* WhatsApp templates provided above are starter drafts you can submit for approval; they’ll be stored in the system as Draft → Submitted → Approved per the PRD.

---

Tell me which immediate artifact(s) you want me to generate now (OpenAPI, Docker Compose starter, GCP Terraform, Postman collection) and I’ll output them into the chat. If you want me to start writing code (starter repo skeleton or a sample React page for the Agent Library), say which and I’ll produce that next.

