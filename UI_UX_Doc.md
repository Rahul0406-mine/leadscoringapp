# **Agent Outreach AI — Detailed Design Report & Style Guide**

**Version:** 1.0

**Scope:** Lightweight but complete design system (tokens \+ components), detailed UX specifications and annotated wireframes for the following screens:

* AI Agents (CRUD)

* Flow Builder (drag & drop with reusable agent blocks)

* Inbox (SMS / WhatsApp / Email tabs, merged conversation list filtered per channel)

* Campaign creation (templates \+ template status tracker)

* Analytics (Campaign Analytics \+ Agent Metrics)

This document is written as a developer-facing handoff: it includes design rationale, component specs, interaction patterns, accessibility rules, responsive behavior, and handoff artifacts (tokens, Tailwind snippets, example components). Use this as the single source of truth for UI/UX implementation.

---

# **Executive summary**

This design delivers a compact, utilitarian UI focused on clarity, speed, and minimal engineering cost. The primary design direction is **Minimal Functional**: a clear visual hierarchy, token-based styling (CSS variables \+ Tailwind tokens), and a small set of reusable components that cover all screens. The UI prioritizes desktop-first workflows (the product will mainly be used by agents at workstations) while remaining fully responsive.

Primary goals for this design:

* Enable fast agent workflows (create agents, assemble campaign flows, monitor performance).

* Reduce cognitive load with consistent patterns and explicit affordances (clear action buttons, status chips, safeguarded destructive actions).

* Provide developer-friendly tokens and component plumbing for rapid implementation with Tailwind \+ shadcn/ui.

---

# **Primary design direction (recommended)**

**Minimal Functional** — characteristics:

* Neutral color palette with a single accent color for primary actions.

* High information density for lists/tables (compact rows by default) with optional relaxed density for readability.

* Clear status chips and badges for templates/agents to highlight state quickly.

* Components implemented as accessible HTML patterns with ARIA attributes and keyboard-first interactions.

**Why:** minimal reduces implementation cost, fits the MVP resource constraints, and focuses user attention on business-critical tasks.

**Alternative directions (only if requested):**

* **Expressive / Brand-forward:** stronger brand colors, illustrations, and motion. Higher dev cost.

* **High-density Pro-trader:** ultra-compact rows, condensed typography, keyboard-driven actions. Good for power users but steeper learning curve.

---

# **Guiding principles**

1. **Clarity over cleverness.** Every screen should make primary tasks obvious.

2. **Consistency.** Use tokens; reuse patterns across screens.

3. **Accessibility by default.** Sufficient contrast, keyboard nav, ARIA for interactive controls.

4. **Progressive complexity.** Start with CRUD and simple flows; expose advanced controls via settings or advanced panels.

5. **Safe defaults.** Dangerous actions require confirmation; templates cannot be sent unless `Approved`.

---

# **Design tokens (CSS variables \+ Tailwind mapping)**

Use these tokens as the canonical source for color, spacing, typography, radii and shadows. Example names suitable to map to both CSS variables and Tailwind config.

## **Color palette**

* `--color-bg` : \#0F1724 (page background — dark variant for sidebar contrast) — *optional if dark mode selected*.

* `--color-surface` : \#FFFFFF (card & surface background)

* `--color-muted` : \#6B7280 (muted text)

* `--color-text` : \#0F1724 (body text)

* `--color-primary` : \#2563EB (primary action / links)

* `--color-primary-600` : \#1D4ED8

* `--color-success` : \#16A34A

* `--color-warning` : \#F59E0B

* `--color-danger` : \#DC2626

* `--color-info` : \#0891B2

* `--color-surface-2` : \#F3F4F6 (secondary surface / forms)

* `--color-border` : \#E5E7EB

**Template status colors**

* `--status-draft` : \#F3F4F6 (neutral)

* `--status-submitted` : \#FBBF24 (amber)

* `--status-approved` : \#10B981 (green)

* `--status-rejected` : \#EF4444 (red)

*Notes:* Choose a single accent color (primary) and ensure alternatives for hover/active states.

## **Typography**

**Font stack (recommended):** `Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`.

Token set (px / rem):

* `--font-size-h1` 32px / 2rem; weight 700

* `--font-size-h2` 24px / 1.5rem; weight 600

* `--font-size-h3` 18px / 1.125rem; weight 600

* `--font-size-body` 14px / 0.875rem; weight 400

* `--font-size-sm` 12px / 0.75rem; weight 400

* `--line-height-default` 1.4

**Usage:** H1 page titles, H2 section headings, H3 subheadings. Body at 14px for compact lists.

## **Spacing / Grid**

Base unit: 4px.

* `space-1` \= 4px

* `space-2` \= 8px

* `space-3` \= 12px

* `space-4` \= 16px

* `space-5` \= 20px

* `space-6` \= 24px

* `space-8` \= 32px

* `space-10` \= 40px

**Layout grid**: 12-column responsive grid. Container width constraints: 1200px center for desktop.

## **Radii & Shadows**

* `radius-sm` \= 4px

* `radius-md` \= 8px

* `radius-lg` \= 12px

**Shadow**

* `elevation-1`: `0 1px 2px rgba(16,24,40,0.04)`

* `elevation-2`: `0 4px 12px rgba(16,24,40,0.08)`

## **Motion**

* `motion-fast` 120ms (tap-feedback)

* `motion-default` 200ms (hover/enter)

* `motion-slow` 320ms (panel transitions)

---

# **Component library (detailed specs)**

Each component description includes: purpose, anatomy, interactive states, accessibility notes, and implementation tips.

## **1\. Buttons**

**Variants**: Primary, Secondary, Ghost, Danger, Text-only.

**Sizes**: small (h-8), medium (h-10), large (h-12).

**Anatomy**: \[Icon(optional)\] \+ label \+ spinner(optional).

**States**: default, hover, active, focus (outline), disabled.

**Implementation tips**:

* Primary: filled with `--color-primary`, white text. Hover \=\> darker primary. Focus \=\> 2px ring using `--color-primary-600` at 30% opacity.

* Disabled: lower contrast, `opacity: 0.5` and `pointer-events: none`.

* Provide `aria-pressed` for toggle buttons and `aria-label` for icon-only buttons.

**Example Tailwind utility** (for devs):

"btn-primary": "px-4 py-2 rounded-md font-medium bg-primary hover:bg-primary-600 focus:ring-2 focus:ring-primary-300 text-white"

## **2\. Inputs (Text, Textarea, Select)**

**Anatomy**: Label, input, helper text, error text.

**States**: idle, focus (border-primary \+ ring), error (border-danger \+ icon), disabled.

**Validation**: inline validation on blur and on submit. Error copy uses `--color-danger` and small text.

**File Upload / KB upload**: Drag area with example filename list; progress bar for uploads. Limit to 50MB per file initially.

## **3\. Toggles / Radios / Checkboxes**

Use accessible elements with `role` and `aria-checked`. Ensure keyboard focus and visual states.

## **4\. Badges & Status Chips**

**Use cases**: template state (Draft, Submitted, Approved, Rejected), agent state (Active, Inactive), channel badges (SMS, WhatsApp, Email).

**Anatomy**: small rounded pill with icon optional and short label.

**Sizes**: small (10–14px text). Use `radius-md`.

**Color mapping**: Approved (green), Submitted (amber), Draft (neutral), Rejected (red).

## **5\. Tables / Lists (Agents Library & Inbox)**

**List densities**: compact (default) & comfortable (user toggle). Default compact rows: 56px height.

**Columns for Agents list**:

* Checkbox, Agent name (with type icon), Type (chat/voice), Model (light/balanced/high-quality), Avg latency (ms), Est cost/min, Status, Last updated, Actions (ellipsis menu)

**Inbox conversation list row**:

* Contact avatar/initials, name \+ lead source badge, last message preview (truncated), unread badge, last message time, channel icon, consent indicator (small), assigned agent tag.

**Row interactions**: hover reveal quick actions (reply, call, assign), click opens conversation pane.

**Sorting & filtering**: column sort for Agents; channel filter for Inbox; search box with incremental search.

## **6\. Cards**

Minimal cards with header, body, footer. Used for metrics and agent details.

## **7\. Modals / Drawers**

* Use modals for destructive confirmations and small configuration forms.

* Use right-side drawers for long forms like Create/Edit Agent and Campaign step editor — keeps context of the page behind.

* Drawers should be keyboard accessible and closable via ESC.

## **8\. Tooltips & Help**

Tooltips appear on hover/focus for icons and abbreviations. Keep tooltip copy ≤ 12 words.

## **9\. Toasts & Alerts**

Toasts for system messages (saved, error, webhook failure). Auto-hide after 5s; include manual close.

---

# **Screen-level specs & annotated wireframes (text annotations)**

NOTE: These are high-fidelity wireframe annotations intended to be turned into clickable prototypes. They describe layout, behavior and microcopy precisely so a developer or a prototyper can implement quickly.

## **AI Agents Tab — list view (CRUD)**

**Page layout**: Full page with top bar (title \+ Help \+ Primary CTA `Create Agent`) and a secondary toolbar (Search, Filter dropdown \[All/Active/Inactive\], `See All` link, New Template button).

**Left area**: table/list of agents (columns as above). Default filter: Active. Row height: 56px. Support multi-select checkboxes for bulk actions (Delete, Export, Duplicate).

**Right area (detail panel)**: When a row is clicked, open a right-side drawer showing agent details: name, type (chat/voice), model tier, tone, knowledge base list, webhook logs (last 5), usage caps, and `Test Agent` button.

**Create/Edit agent flow (drawer)**

* Drawer header: "Create Agent" or "Edit: Agent Name"

* Sections (accordion or vertical tab):

  1. **General**: name, type (radio: Chat / Voice), short description, owner/team.

  2. **Prompt**: system prompt (textarea), few-shot examples (list), tone (dropdown).

  3. **Model**: model tier selector (light / balanced / high-quality) \+ explainers (short copy: latency vs. quality) — provider names hidden.

  4. **Knowledge base**: upload area (drag & drop) \+ optional URL list; upload progress \+ doc preview (filename \+ size \+ parsed text count).

  5. **Webhooks**: add webhook (URL, method POST/GET, Auth header token, payload template using handlebars `{{lead.name}}`, retry policy dropdown: 0/1/2 (default 2)).

  6. **Voice settings** (only for Voice Agents): TTS voice select, streaming vs pre-recorded toggle, call timeout.

  7. **Usage & Limits**: tokens/min cap, concurrent calls, spend cap (USD); warn on high caps.

  8. **Advanced**: fallback/escalation (route to human), version notes.

**Buttons**: `Save Draft`, `Save & Publish` (publish toggles agent active), `Cancel`.

**Validation rules**:

* Name required.

* Prompt minimum 50 characters recommended.

* Webhook URL must be valid URL; token stored encrypted.

**Test Agent console**

* Inline section in drawer: input field for test prompt; `Run Test` shows agent response with latency, token estimate and cost estimate. Provide a button to `Play TTS` for voice agents.

**Delete flow**

* Delete triggers modal with message: "Delete agent ‘X’? This action cannot be undone. Campaigns referencing this agent will be shown an error until you replace the agent." Provide check: "I understand".

## **Flow Builder — drag & drop (agent blocks)**

**Canvas area**: central large canvas (default 1200px centered) with left-side palette and right-side inspector.

**Left palette**

* Search field \+ draggable blocks:

  * **Message** (SMS/WhatsApp) node

  * **Agent** node — pick from Agent Library (click to open modal to choose one saved agent; drag-drop places placeholder requiring selection)

  * **Delay/Wait** node

  * **Condition/Branch** node

  * **Action** node (webhook/CRM)

  * **Voice Call** node

**Agent block specifics**

* Icon: small agent avatar. Title: Agent name (truncate). Mini-stats: avg latency badge.

* When dropped, if agent not selected, open modal to pick one from library; designers: default to the last-used agent for faster flow creation.

**Inspector (right panel)**

* When a node is selected, show configurable fields: channel, message body (WYSIWYG with template variables and template picker), wait conditions, branch logic, retries.

* For Agent nodes: allow override of tone or prompt snippet, but show a notice: "This will not update the Agent Library prompt unless you save as new Agent."

**Connections**

* Directed connectors with clear arrowheads; hover shows duration or branch label.

* Allow multi-select and group move.

* Keyboard shortcuts: delete (Del), undo (Cmd/Ctrl+Z), redo (Shift+Cmd/Ctrl+Z), duplicate (Cmd/Ctrl+D).

**Canvas features**

* Zoom (50%–200%), snap-to-grid, auto-layout suggestions.

* Validate flow button: runs simple static validations (missing agent, template not approved, circular loops).

* Save / Export JSON (for import & export across accounts).

**Accessibility**

* Allow inspector-only creation path for keyboard users: select a node type from a toolbar and fill fields without drag-drop.

**Example node size**

* Message node: 240px wide × 88px high (compact). Agent node: 240px × 120px (includes avatar \+ snippet).

## **Inbox (SMS / WhatsApp / Email tabs)**

**Top bar**: page title (Inbox), global search, channel tabs (SMS / WhatsApp / Email), filters (Unread / Assigned to me / With attachments), Create new message CTA.

**Layout**: 3-column responsive layout (desktop)

* Left: Folder / Shortcut column (Inbox, Sent, Templates, Opt-outs)

* Middle: Conversation list (filtered by channel tab). Row layout as specified in components.

* Right: Message pane (full conversation), top header with contact details, actions (call, assign agent, view lead profile, export convo), message composer at bottom.

**Composer**

* Channel auto-set by active tab and can be overridden via small dropdown.

* Template quick-insert button (opens modal with template status chips). If a template is `Submitted` or `Draft` for WhatsApp, show `Cannot send until Approved` message with link to template submission helper.

* Attach file button, emoji, schedule send (optional), send button.

**Gmail integration**

* Email threads should appear in the Email tab and map to the same conversation model (thread id, subject). When a user replies in-app, choose to reply via Gmail (send via linked account) or send SMS/WhatsApp fallback.

**Voice transcripts**

* Conversations will show call logs and attached transcripts; user can play audio and click `Request human follow-up`.

**Opt-out handling**

* If lead has opted out, composer shows a red banner and disables send unless user re-confirms (legal requirement). Record consent time and source.

## **Campaign creation (templates & template status)**

**Campaign editor**: multi-step modal or page that integrates with Flow Builder.

* Step editor: each step maps to a node in the flow builder and contains channel, message body (template), agent override (optional), wait & retry conditions.

* Template picker inside message body editor shows templates filtered by channel and status chips. For WhatsApp templates: show current approval state.

**Template workflow**

* Templates can be authored in the editor and saved as Draft. A submission flow (button `Submit for Approval`) triggers a flow that will mark status: `Submitted`. An admin or system job updates `Approved`.

* Show in the UI: submission timestamp, approval ETA (if available), and list of languages.

**SMS templates**

* SMS templates do not need external approval but must be saved and available for reuse. Provide placeholders list and a preview character count (SMS segments) and estimated cost per send.

**Validation**

* Campaign cannot be activated if any step uses an `Approved`\-required template that is not `Approved`.

## **Analytics — in-app (Campaign \+ Agent metrics)**

**Top-level layout**: two tabs or anchor sections: `Campaign Analytics` and `Agent Analytics`.

**Campaign Analytics**

* KPI row (cards): Active campaigns, Messages sent (30d), Reply rate, Conversion % (lead→appointment), Cost per conversion.

* Time-series chart: messages sent & replies over time (line chart). Use stacked bars \+ line for conversion.

* Table: top performing campaigns with columns: Campaign name, Touches, Messages Sent, Reply %, Conversion %, ROI estimate.

**Agent Analytics**

* Filter dropdown (Active/Inactive/All) — default Active.

* KPI row: avg latency (ms), p95 latency, messages handled, avg cost/min (for voice), webhook failure rate.

* Agents table (compact rows): name, type, avg latency (ms), p95, est cost/min USD, status chip, last 50 sessions quick link.

* Clicking an agent opens the agent detail card with timeline of recent sessions, top failing webhooks and a `Test Agent` console.

**Interactivity & exports**

* Date range (quick presets: 7d, 30d, 90d), agent filter, campaign filter.

* CSV export for the current table view and PDF export for dashboards.

---

# **Accessibility & internationalization**

**A11y checklist**

* All interactive controls reachable via keyboard (tab order logical).

* Sufficient color contrast (WCAG AA minimum) for text and status chips. Verify colors meet contrast (use darker text on light backgrounds).

* Drag-and-drop alternatives (inspector-based node creation) for keyboard/screen-reader users.

* Screen reader labeling: `aria-label` on icon buttons, `aria-describedby` for error text.

**I18n**

* UI must support content in English (US) for MVP. Keep strings externalized for later translation.

* Template placeholders support non-Latin scripts; test character counts for SMS segments.

---

# **Responsiveness & mobile patterns**

**Breakpoints**

* `sm` 640px

* `md` 768px

* `lg` 1024px

* `xl` 1280px

**Desktop-first notes**

* Flow Builder: desktop only full canvas. Mobile presents a simplified ‘step list’ editor to create flows using the inspector (no drag canvas in MVP). Provide `Edit on desktop` CTA when flow complexity detected.

* Inbox: responsive to 2-column on tablet (list \+ message) and single column on mobile (conversation list → tap to open message view). Tabs collapse into a channel dropdown on small screens.

---

# **Microcopy & interaction wording (examples)**

**Create Agent CTA**: "Create Agent"  
 **Agent test results**: "Response (latency: 312 ms — tokens: 128 — est. cost: $0.003)"  
 **Template approval tooltip**: "WhatsApp templates require Meta approval. Status shows current approval state."  
 **Delete agent confirmation**: "This will permanently delete Agent ‘{name}’. Campaigns that use this agent will pause. Type DELETE to confirm."

Keep copy concise and action-oriented. Error messages should contain a suggested remediation.

---

# **API & dev handoff snippets**

**Tokens & Env**

* Provide `CSS` variables, and a small `tailwind.config.js` snippet mapping primary color tokens.

**Sample CSS variables block**

:root{  
  \--color-primary: \#2563EB;  
  \--color-primary-600: \#1D4ED8;  
  \--color-text: \#0F1724;  
  \--color-surface: \#FFFFFF;  
  \--radius-md: 8px;  
}

**Tailwind snippet** (example)

// tailwind.config.js  
module.exports \= {  
  theme: {  
    extend: {  
      colors: {  
        primary: '\#2563EB',  
        success: '\#16A34A',  
        danger: '\#DC2626'  
      },  
      borderRadius: {  
        md: '8px'  
      }  
    }  
  }  
}

**Suggested API endpoints (developer-friendly)**

* `GET /api/agents` — list agents (query: status, q)

* `POST /api/agents` — create agent (payload: name,type,prompt,modelConfig,kbRefs,webhookConfigs)

* `GET /api/agents/{id}` — get agent details

* `PUT /api/agents/{id}` — update

* `DELETE /api/agents/{id}` — delete

* `POST /api/agents/{id}/test` — run test prompt; returns latency/tokens/response

* `GET /api/campaigns` — list campaigns

* `POST /api/campaigns` — create campaign

* `POST /api/campaigns/{id}/validate` — run static validations

* `GET /api/templates` — list templates

* `POST /api/templates` — create template (channel, body, placeholders, status)

* `POST /api/webhooks/log` — webhook logging

Include server-side checks to ensure templates for WhatsApp are only used when status \= `approved`.

---

# **Handoff deliverables (what I will hand over in this doc)**

1. Complete style guide tokens \+ component specs (this document).

2. Annotated wireframes for AI Agents, Flow Builder, Inbox, Campaign creation and Analytics (within this doc as text specs).

3. Component snippets (CSS variables \+ Tailwind example \+ API endpoint suggestions).

4. Clickable prototype plan: pages to be created in Figma (listed below). I will produce the Figma prototype upon your confirmation.

**Figma prototype pages to create**:

* Style Guide \+ tokens

* AI Agents (list \+ create/edit drawer \+ test console)

* Flow Builder (canvas \+ inspector \+ agent selection modal)

* Inbox (3-channel tabs \+ composer \+ template picker)

* Campaign editor (multi-step modal)

* Analytics (Campaign \+ Agent dashboards)

---

# **Next steps & questions for you**

I’ll start building the Figma clickable prototypes and the high-fidelity screens next. Before I do that, please confirm the following (quick):

1. **Brand color / logo**: do you have a primary brand color or logo to include? If not, I will use the primary token in this doc (\#2563EB).

2. **Pronounced tone for templates**: Do you want prefilled few-shot tones (friendly / formal / persuasive) to map to specific example prompt snippets? If yes, I will include 3 starter prompt templates.

3. **API access plan**: Should the prototype include live data mockups using your sample leads CSV (you uploaded previously) or use seeded dummy data? If you want live sample data in the prototype, provide the sanitized sample CSV.

If you confirm these, I will: 1\) build the Figma file with all pages and tokens and 2\) return a clickable prototype link and an exported developer package (tokens \+ annotated screens).

---

# **Appendix — annotated compact wireframes (ASCII \+ notes)**

Below are compact wireframe sketches to make the layout clear to a developer/prototyper.

### **AI Agents list (compact row)**

\[ Page header: "AI Agents" \] \[Search\] \[Filter: Active ▼\] \[Create Agent\]

|Checkbox| Agent name (icon)	|Type|Model|Avg latency|Est cost/min|Status| ⋮ |  
|  \[\]    | John Agent		| Chat| Balanced| 312 ms| $0.12 | Active | ... |

Click row \-\> open right-side drawer with agent details \+ Test console.

### **Flow builder (very compact)**

\[ Left palette \]  \[ Canvas (nodes \+ connectors) \]  \[ Inspector (node properties) \]

Drag "Agent" \-\> drop on canvas \-\> modal: choose agent from list \-\> node displays name \+ latency.

### **Inbox (three tabs)**

\[ Inbox \] \[Search\]\[Filter\] \[SMS\]\[WhatsApp\]\[Email\]

(Left column)  (Middle)                 (Right)  
Folders         Conversation list       Message pane  
                \[Row: Avatar Name — preview\]  Top header: Name | Actions

---

Thank you — I created a comprehensive design & spec package here. When you confirm the three short questions in the "Next steps" section I will generate the Figma clickable prototype and the developer package (tokens \+ exported slices \+ CSS variables \+ tailwind snippet).

