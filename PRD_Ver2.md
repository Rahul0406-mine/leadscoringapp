Here’s the **updated and final PRD** that now includes the **AI Agents tab** with all the features we discussed (custom chat/voice agents, webhooks, model selection, latency/cost metrics).

---

# **📄 Product Requirements Document (PRD)**

**Product Name**: (TBD — working title: *Agent Outreach AI*)  
 **Version**: v1.1 (Finalized MVP PRD)  
 **Date**: September 2025  
 **Authors**: Product Management (AI-assisted)  
 **Stakeholders**: Founder, Engineering, UI/UX, QA, Compliance, First Client (pilot)

---

## **1\. Executive Summary**

Real estate agents in the US spend too much time manually outreaching and following up with leads. *Agent Outreach AI* reduces that workload by enabling **multi-channel outreach (WhatsApp, SMS, Voice)**, **AI-powered campaign flows**, **two-way messaging**, and **smart analytics**.

In addition, users can now create **custom AI Agents** (chat or voice), which act as the intelligence behind outreach bots. These agents can be configured with prompts, tones, knowledge bases, and webhooks, while tracking latency, cost, and performance.

---

## **2\. Goals & Non-Goals**

### **Goals**

* Save agent time per lead.

* Multi-channel outreach with AI automation.

* Visual flow builder for automation design.

* Two-way inbox (chat \+ voice).

* Analytics for conversion and efficiency.

* TCPA/WhatsApp compliance.

* **Custom AI Agents** as reusable “brains” for chatbots and voice bots.

### **Non-Goals**

* Property listing/transaction management.

* Global compliance (focus: USA TCPA).

* Deep ML lead scoring (future phase).

---

## **3\. Target Market & Personas**

* **Primary Market**: Small real estate agencies & brokerages in the USA.

* **Personas**:

  * *Agent*: manages leads, launches campaigns, chats with leads.

  * *Team Lead/Admin*: manages team, assigns leads, tracks analytics.

  * *Broker/Owner*: makes purchase decision, ensures ROI/compliance.

---

## **4\. Success Metrics**

* Time saved per lead.

* Lead → Appointment conversion %.

* Response rate & response time.

* Cost per lead.

* **MVP Success**: 10 agents onboarded using campaigns & AI Agents.

---

## **5\. Product Scope**

### **In-Scope**

* WhatsApp, SMS, Voice outreach (two-way).

* AI campaign generator with intent bullets.

* Flow builder (drag-drop, JSON export/import).

* Inbox (WhatsApp, SMS, Gmail sync, voice transcripts).

* Analytics (weekly/monthly).

* Consent \+ opt-out management.

* Notifications (email, Slack, in-app, webhook).

* CRM updates via Action Agent.

* **AI Agents tab: create/edit/manage chat & voice AI agents with prompts, tones, KB, webhooks, model selection, latency/cost metrics.**

### **Out-of-Scope**

* Lead scoring ML.

* Real estate listings.

---

## **6\. Core Features & Acceptance Criteria**

### **Multi-channel Outreach**

* ✅ Send campaigns via WhatsApp, SMS, Voice.

* ✅ Attachments supported (SMS/MMS, WhatsApp).

* ✅ Live voice agents supported with recordings.

### **AI-Generated Campaigns**

* ✅ Multi-step campaigns (≥3 touchpoints).

* ✅ Each step: message \+ intent bullets.

* ✅ Editable inline.

* ✅ A/B testing support.

### **Flow Builder**

* ✅ In-browser drag-drop (react-flow).

* ✅ Branching, conditions, variables, retry.

* ✅ JSON import/export.

* ✅ Undo/redo, versioning.

### **Inbox**

* ✅ Two-way sync: WhatsApp, SMS, Gmail.

* ✅ Voice transcripts viewable.

* ✅ Reply box with channel select.

* ✅ Forward replies to phone/Gmail (optional).

### **Action Agent**

* ✅ Update CRM fields (status, tags, profession).

* ✅ Send email/Slack/in-app notifications.

* ✅ Webhook triggers.

* ✅ Retry: 2 attempts \+ agent alert.

### **Analytics**

* ✅ Metrics: conversion %, response %, response time, cost/lead.

* ✅ Time filters: weekly, monthly.

* ✅ Export CSV/PDF/email reports.

### **Lead Management**

* ✅ Fields: name, phone, email, location, interest, source, tags, consent, assigned agent.

* ✅ Import: CSV, API, manual, CRM sync.

* ✅ Deduplication.

* ✅ Opt-out handling.

---

## **7\. AI Agents (New Tab)**

### **Purpose**

Allow users to create **Chat Agents** or **Voice Agents** that act as configurable AI assistants for messaging and calls.

### **Features**

1. **Agent Library**

   * List view with filters, search, status.

   * Columns: name, type, model, avg latency, est. cost/min, last updated.

2. **Create/Edit Agent**

   * Type: Chat Agent / Voice Agent.

   * Prompt editor (system prompt \+ few-shots).

   * Tone selector (friendly, formal, casual, persuasive).

   * Knowledge base upload (docs, URLs, CRM data).

   * Model selection (light/balanced/high-quality).

   * Voice settings (for voice agents): TTS voice, streaming/pre-recorded, call timeout.

   * Custom webhooks (URL, method, auth, mapping, retry policy).

   * Fallback/escalation (route to human).

   * Spend/usage caps.

3. **Agent Analytics**

   * Avg latency (ms), 95th percentile.

   * Cost metrics: est. cost/message (chat), cost/min (voice).

   * Usage history (last 50 sessions).

   * Webhook success/fail logs.

4. **Testing Console**

   * Chat simulator.

   * Voice preview (TTS sample or test call).

5. **Versioning & Templates**

   * Save as template.

   * Export/import agent configs (JSON).

   * Rollback to previous version.

### **Acceptance Criteria**

* Create, edit, delete agents.

* Agents selectable in **Flow Builder, Campaigns, Inbox, Voice setup**.

* Webhooks work with mapped variables & retries.

* Metrics displayed in dashboard.

* Configurable spend/latency controls.

* Test console functional.

---

## **8\. Data Model (additions for AI Agents)**

* agentId, name, type (chat|voice), ownerId.

* prompt, tone, knowledgeBaseRefs.

* modelConfig { name, provider, maxTokens, costEstimate }.

* voiceConfig { ttsVoice, streamMode }.

* webhookConfigs \[ { url, method, auth, payloadTemplate, responseMap } \].

* metrics { avgLatency, p95Latency, costPerMsg, costPerMin }.

* runtimeLimits { tokensPerMin, callsConcurrent, spendCap }.

---

## **9\. Integrations**

* Gmail (OAuth inbox sync).

* Twilio (SMS, voice).

* WhatsApp Business API (via Meta/Twilio).

* CRMs (Salesforce, HubSpot, Pipedrive, Zoho).

* Webhooks (custom from AI Agents, Action Agent).

---

## **10\. Compliance & Security**

* TCPA, WhatsApp template approvals.

* Opt-in/opt-out logging.

* Encryption of API keys and webhook secrets.

* Role-based access.

* Retention: 30 days (MVP).

---

## **11\. Performance & Reliability**

* 2,000 msgs/agent/month.

* 20 concurrent calls/agent.

* 99.999% uptime target.

* Retry: 2 attempts → agent alert.

---

## **12\. UI/UX**

* Minimal, GoHighLevel-inspired.

* Tabs: Dashboard, Leads, Campaigns, Flow Builder, Inbox, Analytics, Integrations, **AI Agents**, Settings.

* Visual analytics & flow builder.

---

## **13\. Roadmap**

### **MVP (2 weeks)**

* Leads, Consent, Multi-channel outbound/inbound.

* AI Campaign Generator.

* Basic Flow Builder.

* Inbox.

* Analytics (weekly/monthly).

* **AI Agents tab with CRUD, prompts, model selection, webhooks, latency/cost display.**

### **Phase 2 (6 weeks)**

* A/B testing, Flow versioning, advanced exports.

* Templates for flows/agents.

* Advanced notifications.

### **Phase 3 (scale)**

* ML lead scoring.

* International compliance.

* Expanded integrations.

---

✅ This is the **final PRD** — complete with the **AI Agents tab**. It can serve as your single source of truth for design, engineering, and onboarding.

---

