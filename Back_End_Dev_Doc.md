Nice — below is a single, final **operational report** you can hand to engineers (or use yourself) that spells out **step-by-step what to build**, **how to sequence it**, and **exactly what I need from you** (accounts, keys, templates, files, webhooks, sample data). I used your final PRD as the single source of truth while preparing this plan.

---

# **Final Build & Handoff Report — Agent Outreach AI (MVP)**

## **Executive summary**

Goal: deliver the MVP features you prioritized — **Outreach flows** (WhatsApp/SMS/Voice two-way) and the **AI Agents tab** (create/edit agents, prompts, model selection, webhooks, latency/cost metrics). This doc is an ordered build plan (phases \+ tasks), a precise checklist of everything you must provide, API/webhook contracts we will support, and acceptance criteria for each major deliverable.

---

## **What I will deliver (high level)**

1. Production-ready backend services (API \+ worker) implementing Agents, Campaigns/Flows, Leads/Inbox, Twilio & Salesforce integrations, and the LLM multi-provider adapter.

2. Database schema \+ migrations (Postgres).

3. Background worker and queue (Redis).

4. Webhook handling (inbound \+ outbound) \+ retry policy and logging.

5. Minimal frontend hooks / API surface for AI Agents and Campaign management (enough for a front-end dev to implement UI or for you to use Postman).

6. Self-hosted analytics stack (Metabase) wired to the same Postgres, and basic dashboards for Agent metrics.

7. CI/CD Docker-based deployment artifacts (Dockerfile, Docker Compose, Terraform starter for DigitalOcean optionally).

8. Documentation: API endpoints, webhook contracts, runbook for on-call and operational notes.

(These features follow your PRD’s scope for AI Agents and Outreach flows.)

---

## **Preflight — items you must provide BEFORE engineering starts**

Group A — Accounts & production credentials

* DigitalOcean account (or cloud provider of choice) \+ API token (for provisioning droplets/managed DBs).

* Twilio: Account SID \+ Auth Token \+ list of Twilio phone numbers to use (E.164 format). Also the Messaging Service SID if used. (You said you already have Twilio — we need keys.)

* Salesforce: Connected App client\_id \+ client\_secret, Salesforce username & password (or OAuth refresh token) for integration user. Required scopes: `api refresh_token offline_access`.

* LLM provider keys (one or more): OpenAI API key, Anthropic key, any others you want to include in multi-provider fallback.

* (Optional now) Sentry DSN, Papertrail / Log drain credentials, and Metabase admin account info.

Group B — Domain & security

* Primary domain name for the app (e.g., app.example.com). We'll provision TLS; supply DNS access (or give us ability to add TXT/CNAME for certs).

* An HTTPS callback URL (public) that Twilio/Salesforce can call (we must register it in Twilio & Salesforce).

Group C — Business content & templates

* WhatsApp message templates (text \+ placeholder spec). These must be the exact templates you'll submit/approve in Meta (save drafts). Include template names, languages, and placeholder positions.

* Example campaign copy for each channel (SMS, WhatsApp, Voice TTS script).

* Fallback escalation instructions (how to route to humans — phone numbers or internal email).

* Knowledge base files for agents (PDFs, text docs, URLs) — one zip or folder per Agent to seed KB.

Group D — Sample data & mapping

* A sanitized sample leads CSV with columns: `name,phone,email,location,source,consent,assigned_agent,notes`.

* CRM field mapping (Salesforce field names ↔ app field names) — a simple table mapping.

Group E — Ops & service access

* GitHub repo access (or Git remote) for code commit \+ CI/CD.

* Container registry credentials (Docker Hub, GHCR) or ability to push images.

* DigitalOcean project ID (or cloud project) if you want us to provision infra.

**How to send secrets:** provide secrets in a vault (recommended) or as an encrypted file. If you’re not using a vault, provide as environment variables in a secure channel.

---

## **API & Webhook contracts (what we will implement — include for your devs)**

### **1\) Inbound webhook endpoint (unified receiver)**

Endpoint: `POST /api/webhooks/receive`

* Purpose: receive inbound events from Twilio (SMS/WhatsApp/Voice), Salesforce callbacks, and generic webhooks.

* We will accept and normalize common fields then enqueue processing.

**Normalized JSON payload** (what your app will use internally)

{  
  "provider":"twilio",  
  "event":"message.received",  
  "channel":"whatsapp",        // or "sms" or "voice"  
  "from":"+14155551234",  
  "to":"+14085551234",  
  "body":"Hello, I'm interested",  
  "media":\[ /\* if MMS/WhatsApp \*/ \],  
  "message\_id":"SMxxxxxxxxxxxx",  
  "received\_at":"2025-09-09T12:34:56Z",  
  "raw": { /\* original payload \*/ }  
}

**Twilio notes:** Twilio POSTs `application/x-www-form-urlencoded`. Our /receive endpoint will accept that and normalize. Twilio expects an HTTP 200 OK within \~15 seconds; we will accept and respond quickly, handling heavy processing async.

**Success expectation:** 200 OK. Retries: Twilio will retry on non-2xx; for others we keep standard retry logic.

---

### **2\) Outbound Action Agent webhook (what campaigns or agents POST to third parties)**

When an Agent is configured to call a custom webhook, payload template variables will be replaced server-side.

**Sample outbound webhook payload template (JSON)**

{  
  "lead": {  
    "id":"{{lead.id}}",  
    "name":"{{lead.name}}",  
    "phone":"{{lead.phone}}",  
    "email":"{{lead.email}}"  
  },  
  "agent": {  
    "id":"{{agent.id}}",  
    "name":"{{agent.name}}",  
    "type":"{{agent.type}}"  
  },  
  "message": {  
    "id":"{{message.id}}",  
    "body":"{{message.body}}",  
    "channel":"{{message.channel}}"  
  },  
  "metadata": {  
    "campaign\_id":"{{campaign.id}}",  
    "timestamp":"{{now}}"  
  }  
}

**Expectations for receivers**

* We POST JSON with an `Authorization: Bearer <token>` header (configurable) and expect a 2xx within 10s.

* Retry policy: 2 retries with exponential backoff (as per PRD). If still failing, webhook\_logs record failure and an alert triggers.

---

### **3\) LLM adapter contract**

* Our backend will call a pluggable adapter: `llm_adapter.request({provider,model,input,stream:false|true,timeoutMs})`

* Response object:

{  
  "provider":"openai",  
  "model":"gpt-4o-mini",  
  "tokens\_prompt":123,  
  "tokens\_completion":456,  
  "latency\_ms":300,  
  "response":"...text..."  
}

* We will log tokens \+ cost estimate per request to llm\_requests table for analytics. Adapter will implement provider failover and a circuit-breaker.

---

## **Build plan — ordered phases & tasks (no timelines, just strict sequence)**

Note: follow this order. Do not skip a phase because later tasks depend on earlier items (DB, secrets, queue, core models).

### **Phase 0 — Project scaffolding & infra access (preflight)**

* Create GitHub repo \+ branch strategy (main/dev/feature).

* Get credentials from you (Group A–E above) and add to secrets store.

* Dockerize app service and worker; create `docker-compose.yml`.

* Provision Postgres (managed) and Redis (managed) — or prepare DO API token for provisioning.

**Acceptance**

* Repo exists; `docker-compose up` boots app (dev mode) and connects to DB \+ Redis using env vars.

* Basic health endpoint `GET /health` returns OK.

---

### **Phase 1 — Core backend models, auth, migrations**

* Implement DB schema (tables: users, agents, campaigns, leads, messages, llm\_requests, webhook\_logs, metrics\_daily).

* Add Alembic (or preferred migration tool) migrations.

* Implement JWT auth (single-user mode, basic admin flag).

* Build basic CRUD endpoints for Agents & Leads (see earlier minimal API spec).

**Acceptance**

* DB migrations run successfully.

* CRUD endpoints for Agents \+ Leads are usable (create/list/get/update/delete) and validated.

---

### **Phase 2 — Queue & background workers**

* Integrate Redis \+ Dramatiq (or RQ/Bull equivalents) for background jobs: LLM calls, webhook retries, scheduled campaign step execution.

* Implement worker that processes llm\_adapter calls and writes llm\_requests \+ metrics.

**Acceptance**

* Worker processes a test LLM job (stubbed) and marks llm\_requests row with latency and tokens.

---

### **Phase 3 — LLM adapter (multi-provider & failover)**

* Implement provider registry \+ async HTTP clients.

* Add health checks, circuit-breaker in Redis, and simple cost estimation (per provider config).

* Support streaming or non-streaming responses (streaming will be proxied to frontend via WebSockets).

**Acceptance**

* `POST /api/agents/{id}/test` returns a valid LLM response via configured primary provider.

* When primary fails (\>error threshold), adapter falls back to secondary.

---

### **Phase 4 — Twilio (SMS/WhatsApp/Voice) integration**

* Implement webhook receiver normalization (`/api/webhooks/receive`).

* Implement outbound sending service using Twilio SDK (send SMS, send WhatsApp template, initiate Voice TTS call).

* Template approval check: block send until template state \= `approved`.

* Implement inbound message processing to create messages \+ leads if unknown.

**Acceptance**

* Inbound Twilio webhook normalized payload is stored as message.

* Outbound send returns Twilio messageSid and is logged in messages table.

* WhatsApp template sends are blocked unless flagged approved.

---

### **Phase 5 — Salesforce integration**

* Implement push to Salesforce on lead create/update (Action Agent) using OAuth.

* Implement webhook listener if you want inbound pushes from Salesforce.

* Map fields via provided mapping table.

**Acceptance**

* A newly created lead in app appears in Salesforce (test account).

* Salesforce lead updates sync back to app when applicable.

---

### **Phase 6 — Campaigns/Flow runner & Agent orchestration**

* Build Campaign API to create multi-step flows referencing agents.

* Implement the flow engine to execute steps (send message → wait for responses/timeout → branch).

* Integrate agent selection per step; agent executes message generation via llm\_adapter.

**Acceptance**

* A sample 3-step campaign executes: SMS → WhatsApp → Voice (TTS) and logs outcomes for each step.

---

### **Phase 7 — Agent Analytics & Test Console (AI Agents tab)**

* Implement metrics aggregations (avg latency, p95, cost estimates).

* Implement test console endpoint (simulate chat, TTS sample).

* Expose Agent Library endpoints with columns described in PRD (model, avg latency, est cost/min).

**Acceptance**

* Agent library lists agents and metrics.

* Test console returns live agent responses and TTS sample audio (or link) when requested.

---

### **Phase 8 — Self-hosted analytics & dashboards**

* Deploy Metabase (or preferred stack) and connect to Postgres.

* Create dashboards: Agent performance, Campaign performance, Webhook failures.

**Acceptance**

* Dashboards display agent monthly message counts, avg latency, p95, and cost totals.

---

### **Phase 9 — QA, security & launch checklist**

* End-to-end tests for Twilio flows (inbound/outbound), Salesforce sync, and webhook retries.

* Security review: secrets encryption, HTTPS, TLS certs, role-based access (even if single admin).

* Retention job (30-day message retention) & backup jobs.

**Acceptance**

* Test scenarios pass; critical alerts configured; backups created and tested.

---

## **Deliverables & Acceptance Criteria (short checklist)**

* `GET /api/agents` \+ CRUD implemented and tested.

* LLM adapter with at least 2 providers and failover.

* Twilio inbound/outbound working for SMS \+ WhatsApp \+ Voice.

* Salesforce push working with field mapping.

* Campaign flow engine that runs multi-step flows and supports agent substitution.

* Agent analytics (avg, p95, cost) visible via API & Metabase.

* Webhook logs \+ retry policy implemented (2 retries → alert).

* Metabase dashboards connected.

* Documentation: API spec \+ sample webhook payloads (provided in repo).

(These reflect the PRD acceptance criteria for AI Agents and Outreach flows.)

---

## **Exact things I need from you *right now* (copy/paste this into an email to hand off)**

1. DigitalOcean API token (or cloud provider \+ token).

2. Twilio Account SID & Auth Token and the list of phone numbers to use (E.164).

3. Salesforce Connected App credentials (client\_id, client\_secret) and an integration user or refresh token \+ username.

4. OpenAI API key and Anthropic API key (or whichever LLMs you want).

5. App domain name \+ DNS access to create TLS records.

6. WhatsApp templates (drafts) as text files with placeholder positions and languages.

7. Knowledge base files (zipped) for initial agents.

8. Sample leads CSV file (sanitized).

9. GitHub repo access \+ container registry access (or tell me where to push images).

10. Sentry DSN (optional) and Metabase admin login (we can also create accounts).

---

## **Quick security & compliance reminders**

* WhatsApp template approval is a business process — do not attempt to send templates until they are approved. Templates must be stored and status tracked in the DB.

* TCPA / opt-in records: every outbound to US numbers must have consent flag on lead record. Log opt-in timestamp and source.

---

## **Helpful extras I can produce immediately (pick any; I’ll produce in this chat now)**

* OpenAPI (Swagger) spec for the APIs above.

* Docker Compose \+ starter FastAPI skeleton (backend \+ worker \+ Postgres \+ Redis).

* Terraform script to provision DigitalOcean Droplet \+ Managed Postgres \+ Managed Redis.

* Postman collection with sample requests (useful to QA Twilio callbacks).

Tell me which of those you want **now** and I’ll generate it instantly in this chat.

---

If you want, I can also paste the **exact env var names** the engineer will need (DB\_URL, REDIS\_URL, TWILIO\_ACCOUNT\_SID, TWILIO\_AUTH\_TOKEN, SALESFORCE\_CLIENT\_ID, etc.) and a minimal `.env.example` file to speed setup. Which extra file should I produce first?

