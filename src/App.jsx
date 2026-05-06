import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════
const LIGHT = {
  "--bg":"#fafbfc","--bg-sidebar":"#f2f3f5","--bg-hover":"#e8eaed","--bg-active":"#dde1e8",
  "--border":"#d4d7de","--text-primary":"#1a1d2e","--text-secondary":"#4a4e60","--text-dim":"#8b8fa3",
  "--text-code":"#2d3148","--accent":"#4a64d4","--accent-dim":"rgba(74,100,212,0.08)",
  "--code-bg":"#f0f1f4","--code-header":"#e8e9ed","--callout-bg":"rgba(74,100,212,0.05)",
  "--inline-code-bg":"rgba(74,100,212,0.08)","--search-bg":"#ffffff","--overlay":"rgba(0,0,0,0.3)",
  "--img-bg":"#f6f7f9","--img-caption-bg":"rgba(74,100,212,0.04)",
  "--tag-latest-bg":"rgba(34,197,94,0.1)","--tag-latest-text":"#16a34a",
  "--font-heading":"'Camber Trial','Source Serif 4','Georgia',serif",
  "--font-body":"'Camber Trial','DM Sans','Segoe UI',sans-serif",
  "--font-mono":"'JetBrains Mono','Fira Code',monospace",
};
const DARK = {
  "--bg":"#0f1117","--bg-sidebar":"#161821","--bg-hover":"#1e2030","--bg-active":"#252840",
  "--border":"#2a2d3e","--text-primary":"#e2e4f0","--text-secondary":"#a0a4b8","--text-dim":"#6b6f85",
  "--text-code":"#c8cce0","--accent":"#6c8aff","--accent-dim":"rgba(108,138,255,0.12)",
  "--code-bg":"#1a1d2e","--code-header":"#141625","--callout-bg":"rgba(108,138,255,0.06)",
  "--inline-code-bg":"rgba(108,138,255,0.12)","--search-bg":"#1a1d2e","--overlay":"rgba(0,0,0,0.6)",
  "--img-bg":"#1a1d2e","--img-caption-bg":"rgba(108,138,255,0.06)",
  "--tag-latest-bg":"rgba(34,197,94,0.15)","--tag-latest-text":"#4ade80",
  "--font-heading":"'Camber Trial','Source Serif 4','Georgia',serif",
  "--font-body":"'Camber Trial','DM Sans','Segoe UI',sans-serif",
  "--font-mono":"'JetBrains Mono','Fira Code',monospace",
};

// ═══════════════════════════════════════════════════════════
// ICONS (inline SVG)
// ═══════════════════════════════════════════════════════════
const I = {
  Search: ({size=18})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Moon: ({size=18})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: ({size=18})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  ChevRight: ({size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>,
  ChevDown: ({size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  Menu: ({size=20})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  X: ({size=18})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Copy: ({size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: ({size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>,
  Home: ({size=14})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  ArrowUp: ({size=18})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 15-6-6-6 6"/></svg>,
  Bell: ({size=16})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Img: ({size=22})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
};

// ═══════════════════════════════════════════════════════════
// RELEASE NOTES
// ═══════════════════════════════════════════════════════════
const RELEASE_NOTES = [
  { version: "0.60.2", sections: [
    { title: "More Reliable File Handling", body: "Fixed an issue where files with detailed content-type headers (e.g., those including charset info) were not being recognized correctly. The system now also detects file types by inspecting content when the type isn't immediately clear, preventing \"unknown file type\" errors during data processing." },
  ]},
  { version: "0.60.1", sections: [
    { title: "Bug Fixes & Stability", body: "This patch resolves two issues from the v0.60.0 release. Load steps that use template variables like {{date}} in file paths now work correctly again — they were being incorrectly rejected by a validation check that ran too early. Additionally, the DDSR report header now correctly displays just the plate number instead of showing the full composite group key." },
  ]},
  { version: "0.60.0", sections: [
    { title: "Summary Batch Processing", body: "Setu now supports batching, allowing data pipelines to group extractions and loads together for more efficient processing of large datasets." },
    { title: "Better Debugging Tools", body: "A new curl command generator lets you inspect and replay API connector requests directly, making it easier to diagnose extraction issues." },
    { title: "Run Attribution", body: "Every episode now tracks who triggered it — whether from a scheduled run, manual trigger, or portal retry — giving full visibility into pipeline activity." },
    { title: "Report Improvements", body: "Report routines have better validation, and report outputs can now be downloaded as PDFs directly." },
    { title: "Performance & Reliability", body: "Step outputs now upload synchronously for immediate durability. Stalled job detection is faster (10 minutes vs 24 hours), and episode listing is significantly more efficient with reduced database queries." },
    { title: "Stability Fixes", body: "Fixed invalid JSON response handling in the data loading pipeline to prevent unexpected errors." },
  ]},
];

// ═══════════════════════════════════════════════════════════
// DOCS — flat array, categories auto-generated from `category` field
// ═══════════════════════════════════════════════════════════
const docs = [
  // ── Introduction ──
  { id:"what-is-setu", title:"What is Setu?", category:"Introduction",
    image: "Setu-MP.png",
     content:`# What is Setu?

Setu is a robust middleware solution designed for efficient data integration and engineering. At its core, Setu functions as an Extract, Transform, Load (ETL) platform, meticulously supporting the extraction, transformation, and loading of data between a diverse array of sources. This comprehensive capability ensures seamless data flow and integrity across various systems.

## Who is Setu for?

Setu is used by StackBox engineers and operations teams to automate data flows between internal systems, external APIs, databases, SFTP servers, and email.

## What can you do with Setu?

- **Extract** data from databases, APIs, and SFTP servers
- **Transform** data using SQL or Python scripts
- **Load** processed data into databases, APIs, SFTP locations, or send via email
- **Schedule** routines to run automatically via cron expressions
- **Generate** formatted Excel reports with dynamic templates
- **Migrate** routines between environments (Staging → UAT → Production)

## Core Philosophy

In Setu, ETL is a concept — not a rigid sequence. Steps can be arranged in any order:

\`\`\`
E → T → L          (standard)
E → L → T → L      (load intermediate, then transform and load again)
T → E → L          (build query first, then extract and load)
E → T → L → T → L  (multiple transform-load cycles)
\`\`\`

What matters is: **data flows through steps until the final output is ready.**` },

  { id:"key-concepts", title:"Key Concepts", category:"Introduction", content:`# Key Concepts

## Routine
Setu facilitates the creation and management of data syncing pipelines, referred to as "routines." These routines are the backbone of data movement within the platform. They can be configured to operate in two primary modes:
- **Scheduled Routines:** For recurring data synchronization tasks, routines can be scheduled to run at predetermined intervals, ensuring timely and automated data updates. This is ideal for batch processing and maintaining data consistency over time.
- **API-Exposed Routines:** For real-time or on-demand data exchange, routines can be exposed over an Application Programming Interface (API). This allows other applications and services to trigger data syncing as needed, enabling dynamic and event-driven data integration.

## Step
Each step performs one action: **Extract** (get data), **Transform** (process data), or **Load** (deliver data).

## Episode
The concept of "Episodes" is central to understanding how routine occurrences and their associated data are managed and tracked. Each Episode represents a single, distinct execution of a routine. During its lifecycle, an Episode records all data that is received, transformed, and subsequently loaded at every stage of the routine's execution. Any errors or anomalies encountered during these processes are also logged within the Episode, providing a comprehensive audit trail for troubleshooting and analysis.

## Connection
A pre-configured link to an external system (database, API, SFTP, email). Created by DevOps; users select from a dropdown.

## Layout
An Excel file defining how data should be mapped, typed, and validated before loading.

## Node / Principal
The organizational unit where routines live. Select a node first, then create routines within it.

## Table References
Step 1's output is \`table_1\`, Step 2's is \`table_2\`, etc. You can also use **Step Code** (e.g., \`table_orders\`) as named aliases.` },

  // ── Getting Started ──
  { id:"creating-a-routine", title:"Creating a Routine", category:"Getting Started",image: "New_Routine.png", content:`# Creating a Routine

1. **Go to the required Node or Principal** — select the node where you want the routine.
2. **Click the + icon** — opens the creation menu.
3. **Select "Routine"** from the menu.
4. **Give it a name** — something descriptive (e.g., \`daily_order_sync\`).
5. **Select the steps** you need (Extract, Transform, Load — in any order).
6. **Click "Yes"** — the routine is created and ready to configure.

## After Creation

Once created, you'll see the step editor. Each step has its own configuration panel for connection, scripts, and settings.

> **Tip:** You can always add, remove, or reorder steps after creation.` },

  { id:"understanding-steps", title:"Understanding Steps", category:"Getting Started", content:`# Understanding Steps

A routine works using **steps**. Each step performs one action on the data.

## Extract (Getting Data)
An Extract step is responsible for retrieving raw data from its source. This could involve connecting to various databases, APIs, file systems, or streaming services.

## Transform (Working on Data)
Once data is extracted, it often requires manipulation and refinement to meet the specific needs of the destination or for analytical purposes. A Transform step is dedicated to this crucial process. This can encompass a wide array of operations, such as data cleaning, normalization, aggregation, enrichment, or restructuring. 

## Load (Delivering Data)
A Load step is responsible for delivering the transformed data to its designated target system. This could involve inserting data into a data warehouse, updating records in an operational database, publishing messages to a message queue, or writing to a file storage system.

## Maps
This step addresses the mapping requirements within specific microservices, such as Polaris. Consequently, users are granted access to maps displaying coordinates and legends. Furthermore, the maps offer users the flexibility to customize various features, including the presence or absence of legends on coordinates, the rendering of data points with arcs or straight lines, color adjustments for coordinates, and the definition of scales for these colors etc.

## Flexible Ordering

\`\`\`
E → T → L           Standard pipeline
E → L → T → L       Intermediate load, then transform and re-load
T → E → L           Build dynamic query, then extract and load
E → T → L → T → L   Multi-stage processing
\`\`\`

While we will delve into each step type in greater detail in dedicated sections, it's important to understand some overarching features and components common to many steps:

- **Script Boxes:** A powerful and flexible component within each step, the Script Box allows for custom logic and operations. As mentioned, a Transform step's Script Box might utilize SQLite for complex data manipulations, while other step types could support writing different API routes or SFTP paths with file name etc. 

- **Retry Mechanism with Backoff:** Recognizing that external systems or network conditions can sometimes lead to failures, every step in our pipeline is equipped with a robust retry mechanism. If a step encounters an error during execution, it will automatically attempt to re-execute after a specified "backoff time." This backoff time typically increases exponentially or constantly as added by the editor with each retry attempt, preventing overwhelming the failing system and allowing it time to recover. This feature enhances the reliability and resilience of our data pipelines.

- **Step Parameters (Step Params):** To provide granular control and configurability, each step can be configured with various "Step Params." These parameters allow for dynamic adjustments and specialized behavior without altering the underlying step logic. Examples of common Step Params include:
  
  → **Origin:** Specifies the source or origin point of the data being processed by the step.
  → **Min Rule / Max Rule:** These parameters might define thresholds or validation rules for data, ensuring that only data conforming to specific criteria is processed.
  → **Parser:** Indicates the parsing mechanism to be used for interpreting the incoming data like csv, xlsx or json.

## Table References

- Step 1 → \`table_1\`, Step 2 → \`table_2\`, Step N → \`table_N\`
- With **Step Code** (e.g., \`orders\`): reference as \`table_orders\` or \`step_orders.main\`` },

  { id:"episode-view", title:"The Episode View", category:"Getting Started",image: "Episode.png", content:`# The Episode View

Every routine run creates a new **Episode** with execution details.

## What You Can See

- **Step-by-step status** — succeeded, failed, or in progress
- **Error messages** — details on failures
- **Duration** — how long each step took
- **Downloads** — download output data from any step
- **Timestamps** — start and finish times

## Datewise View

Track complete execution history day by day — all episodes per date with execution details.

> **Tip:** Use Datewise to spot patterns — like a routine failing every Monday due to upstream data delays.

## Attempts
Attempts are basically instances of one step which is executed , in case the step has been retried ( manually or automatically )  then we can further dwell and check the response of each of the steps that has been executed. An "attempt" denotes a singular execution of a process automation step. Should a step encounter failure, a "retry" may transpire either automatically (system-initiated for transient errors) or manually (user-initiated following investigation). The analysis of individual step responses, including those from retries, is paramount for debugging, auditing, and comprehending process flow. This facilitates the identification of failure points, the observation of progress, performance analysis, troubleshooting, and ensures regulatory compliance by furnishing a comprehensive execution history. 


` },

  // ── Extract Steps ──
  { id:"extract-overview", title:"Overview", category:"Extract Steps", content:`# Extract Steps — Overview

Extract steps bring data into your routine. Configuration depends on the **connection type**.

| Connection | Script Box Usage | Method Dropdown |
|:-----------|:-----------------|:----------------|
| Database (DB) | SQL query | Not applicable |
| API | Endpoint + params | GET, POST, PUT, PATCH, DELETE |
| SFTP | File path | Not applicable |

## How It Works

1. **Select a Connection** from the dropdown (pre-configured by DevOps).
2. **Write your script** — SQL for DB, endpoint for API, file path for SFTP.
3. **Configure settings** — timeout, retries, row validation, etc.
4. Output becomes \`table_N\` for downstream steps.

## Key Settings

- **Skip Errors** — when enabled, the routine continues to the next step even if this one fails. Useful when the extract is optional or when downstream steps handle missing data gracefully.
- **Create Temporary Tables** — creates temp tables in the database during extraction. Helpful for complex queries that need intermediate results before joining.
- **Commit** — commits the database transaction after this step finishes. Relevant when your extract query has side effects like calling a stored procedure.
- **Explain** — shows the query execution plan, equivalent to running \`EXPLAIN\` in your database client. Use it when a query is slower than expected.
- **Step Code** — a human-readable alias for the step's output. Set it to \`orders\` and reference as \`table_orders\` downstream. Avoids breakage when inserting new steps shifts positional \`table_N\` numbers.
- **Title** — human-readable name for the step. Appears in the episode view and error emails. Choose something descriptive so failures are easy to identify at a glance.
- **Min/Max Rule** — row count validation on the step's output. "At least 1" catches empty extractions, "Custom min" sets a specific threshold, "Previous or more" ensures no data loss between steps. Max rules work the same way in reverse.
- **Error Email** — sends an email notification when this specific step fails. Configured per-step with Sender Address, Sender Name, Receiver Address, and Subject. Useful for critical steps where a team needs immediate alerts.
- **Timeout** — how long the step can run before Setu kills it. Default **10 minutes**. Increase for heavy queries or slow APIs. Consistent timeouts usually mean a query optimization issue.
- **Retries** — how many times Setu retries after failure. Default **3**. Each retry re-executes the step from scratch. Useful for transient failures like network timeouts.
- **Backoff** — wait time between retries. Default **30 minutes**. Gives the external system time to recover before the next attempt. Growth is constant by default.`},
  
{ id:"extract-db", title:"Database Extraction", category:"Extract Steps", content:`# Database Extraction

When your connection is a database, the Script Box accepts standard SQL.

## Basic Query

\`\`\`sql
SELECT order_id, customer_code, warehouse_id, status
FROM orders
WHERE created_at >= '2025-01-01'
LIMIT 1000
\`\`\`

## With JOINs and Filters

\`\`\`sql
SELECT o.order_id, c.customer_name, w.warehouse_code
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN warehouses w ON o.wh_id = w.id
WHERE o.status = 'delivered'
    AND o.created_at BETWEEN '2025-01-01' AND '2025-06-30'
GROUP BY o.order_id, c.customer_name, w.warehouse_code
\`\`\`

Standard SQL is fully supported: \`SELECT\`, \`JOIN\`, \`WHERE\`, \`GROUP BY\`, \`CASE\`, aggregations, subqueries.

> **Tip:** For complex queries, check the **Timeout** setting (default 10 min) and increase if needed.` },

  { id:"extract-api", title:"API Extraction", category:"Extract Steps", content:`# API Extraction

The Script Box takes the **endpoint path** (base URL comes from the connection). Select HTTP method from the dropdown.

## Static Endpoint

\`\`\`
/json_apis/getOrders?warehouseId=12345&status=active
\`\`\`

## Dynamic Endpoint (Parameterized)

Use \`{{column_name}}\` placeholders. Setu makes one API call per row from the previous step:

\`\`\`
/json_apis/getOrders?warehouseId={{warehouseId}}&status=active
\`\`\`

If previous step has \`warehouseId\` values 2, 3, 4, 5 — Setu makes four calls and **combines results** into a single output.

> **Tip:** Great for APIs that don't support bulk queries. Prepare parameter values in a previous step, Setu handles looping.` },

  { id:"extract-sftp", title:"SFTP Extraction", category:"Extract Steps", content:`# SFTP Extraction

The Script Box takes the **file path** on the remote server.

\`\`\`
/inbound/daily_reports/inventory_report.xlsx
\`\`\`

## Parsing Excel Files

Set **Parser** to \`XLSX\` and specify the **Sheet Name**.

| Parser | Use For |
|:-------|:--------|
| CSV | Comma-separated files |
| XLSX | Excel workbooks (.xlsx) |
| XLSB | Binary Excel workbooks (.xlsb) |

> **Tip:** For files with dynamic names, check if your setup supports file patterns.

## Connecting to SFTP

To work with SFTP files, you first need to connect via an SFTP client (e.g., FileZilla):

1. **Open your SFTP client** — launch the application and navigate to the top ribbon/menu bar.
2. **Open Site Manager** — click "File" → "Site Manager". This opens the configuration window.
3. **Enter connection details** — click Edit/New Site, then provide:

| Field | Value |
|:------|:------|
| File Protocol | SFTP (SSH File Transfer Protocol) |
| Host Name | Provided by your administrator |
| Port Number | Usually \`22\` (or as provided) |
| User Name | Your SFTP username |
| Password | Your SFTP password |

4. **Save and connect** — click Save, then click Login/Connect.

## Understanding the Interface

After successful login, you will see two panels:

- **Left Side (Local System)** — displays files from your computer.
- **Right Side (SFTP Server)** — displays files stored on the remote server.

## Uploading Files

1. **Select the file** from the left panel (local system)
2. **Drag it** to the right panel (SFTP server)
3. **Drop it** into the desired folder

## Downloading Files

1. **Select the file** from the right panel (SFTP server)
2. **Drag it** to the left panel (local system)

## Copying File Path for Setu

To use SFTP files in Setu, you need the full file path:

1. **Right-click** on the file in the SFTP panel (right side)
2. **Select** File Name → Copy to Clipboard (Include Path)

This copies the full path which can be pasted directly into Setu's Extract step as the source path.

## Loading Files to SFTP

In a Load step with connection type SFTP, provide the destination file path:

\`\`\`
/folder1/file.xlsx
\`\`\`

- If \`folder1\` does not exist, it will be **created automatically**
- The file \`file.xlsx\` will be created inside the folder
- Data from the previous step will be written into the file

> **See also:** SFTP Load for Jinja dynamic filenames and Group By configuration.

## Key Notes

- Ensure credentials are correct before connecting
- Always verify file paths before using them in Setu
- Folder paths must start with \`/\`
- Drag-and-drop is the easiest way to transfer files` },
  // ── Transform Steps ──
  { id:"transform-overview", title:"Overview", category:"Transform Steps", content:`# Transform Steps — Overview

Transform steps process data using **SQL** or **Python** (Script Type dropdown — SQL is default).

## What Transforms Do

- Validations and business rules
- Calculations and aggregations
- Data formatting and filtering
- Datatype conversions
- Merging data from multiple steps

## Table References
Reference previous outputs as \`table_1\`, \`table_2\`, etc. Or use **Step Code** aliases.

> **The output must be a table (SQL result set or Python DataFrame).** This becomes input for the next step.

## Key Settings

- **Script Type** — choose between **SQL** (default) and **Python**. SQL for joins, filters, aggregations. Python for complex logic, API payload formatting, or anything pandas can do that SQL can't.
- **Bundle** — combines outputs from multiple previous steps into one Excel workbook with each table as a separate sheet. Different from Multi-Sheet in Load, which groups rows within a single table.
- **Save to Meta** — saves the step's output to the routine's metadata for reference outside the routine or auditing.
- **Parser** — file format parser: **CSV**, **XLSX**, or **XLSB**. Only relevant when processing file-based data.
- **Sheet Name** — which sheet to read when using XLSX/XLSB parser. Defaults to first sheet if not set.
- **Step Code** — human-readable alias for the output. Set to \`cleaned_orders\` and reference as \`table_cleaned_orders\` downstream. Avoids breakage when inserting steps shifts positional \`table_N\` numbers.
- **Min/Max Rule** — row count validation. "At least 1" catches transforms that accidentally filter out all data. "Previous or more" ensures your transform didn't drop rows unintentionally. Max rules catch row explosions from bad joins.
- **Error Email** — per-step failure notification. Especially useful for transforms with complex Python logic that might fail on edge-case data.
- **Timeout** — how long the step can run. Default **10 minutes**. Increase for heavy pandas operations or transforms processing millions of rows.
- **Retries** — retry attempts after failure. Default **3**. Less commonly needed for transforms since failures are usually logic errors, not transient issues.
- **Backoff** — wait time between retries. Default **30 minutes**. For transforms, a shorter backoff is often fine since the issue is rarely an external system being down.
` },

  { id:"transform-sql", title:"SQL Transforms", category:"Transform Steps", content:`# SQL Transforms

## Basic Transform

\`\`\`sql
SELECT order_id, amount, UPPER(status) AS status
FROM table_1
WHERE amount > 0
\`\`\`

## Joining Multiple Steps

\`\`\`sql
SELECT a.order_id, b.customer_name, a.amount
FROM table_1 a
LEFT JOIN table_2 b ON a.customer_id = b.id
\`\`\`

## Using Step Code

\`\`\`sql
SELECT a.order_id, b.customer_name
FROM table_orders a
JOIN table_customers b ON a.customer_id = b.id
\`\`\`

All standard SQL supported: \`SELECT\`, \`JOIN\`, \`WHERE\`, \`CASE\`, \`GROUP BY\`, window functions, etc.

> **Gotcha:** Inserting a step shifts all downstream \`table_N\` references. **Use Step Code to avoid this.**` },

  { id:"transform-python", title:"Python Transforms", category:"Transform Steps", content:`# Python Transforms

## Function Signature

\`\`\`python
def transform(table_1):
    return table_1  # must return a DataFrame
\`\`\`

For multiple inputs: \`def transform(table_1, table_2):\`

## Import Rules

**All imports inside the function** (except \`time\`):

\`\`\`python
def transform(table_1):
    import pandas as pd
    import numpy as np
    import json
    return table_1
\`\`\`

## Available Libraries

\`pandas\`, \`numpy\`, \`json\`, \`time\`

## Common Patterns

**Conditional columns:**

\`\`\`python
def transform(table_1):
    import numpy as np
    table_1['flag'] = np.where(table_1['amount'] > 5000, 'HIGH', 'NORMAL')
    return table_1
\`\`\`

**JSON handling:**

\`\`\`python
def transform(table_1):
    import json, pandas as pd
    parsed = table_1['json_col'].apply(json.loads)
    expanded = pd.json_normalize(parsed)
    return pd.concat([table_1, expanded], axis=1)
\`\`\`

**Pivoting:**

\`\`\`python
def transform(table_1):
    return table_1.pivot_table(index='warehouse', columns='status',
        values='count', aggfunc='sum', fill_value=0).reset_index()
\`\`\`

> **Key Rule:** The function must always return a DataFrame.` },

  { id:"transform-postman", title:"Receiving Postman Data", category:"Transform Steps", content:`# Receiving Postman Data

External data pushed via Postman is available as \`file_1\` — **not** \`table_1\`.

## SQL Mode

\`\`\`sql
SELECT * FROM file_1
\`\`\`

## Python Mode

\`\`\`python
def transform(file_1):
    df = file_1
    return df
\`\`\`

> **Critical: If using Python to receive Postman data, Awaited must be OFF.** SQL works with both.` },

  { id:"transform-bundle", title:"Bundle", category:"Transform Steps", content:`# Bundle

**Bundle** combines outputs from multiple tables into one Excel workbook with each table as a separate sheet.

## How to Use

1. Check the **Bundle** checkbox in the Transform step.
2. The step combines referenced table outputs into a multi-sheet workbook.
3. The next step (typically Load) receives this combined output.

> **Note:** Bundle is a Transform feature. Different from Multi-Sheet in Load, which controls grouped data output.` },


  // ── Load Steps ──
  { id:"load-overview", title:"Overview", category:"Load Steps", content:`# Load Steps — Overview

Load steps deliver processed data to its final destination.

## What Load Can Do

- Push data to another system via API
- Save data into databases
- Generate output files on SFTP
- Send output via email

> **A Load step always pushes the output of the immediately previous step.** You cannot skip steps.

| Type | Script Box | Layout | Key Features |
|:-----|:-----------|:-------|:-------------|
| API | Endpoint + method | Optional | Singleton, Verbatim |
| Database | Not used | Required | Driven by connection + layout |
| SFTP | Destination path | Optional | Jinja filenames, Group By |
| Email | Not used | — | Subject, Receiver, Body, Attachment |` },

  { id:"load-sftp", title:"SFTP Load", category:"Load Steps", content:`# SFTP Load

## Static File Path

\`\`\`
/outbound/reports/daily_summary.xlsx
\`\`\`

## Dynamic File Names with Jinja

\`\`\`
/outbound/reports/order_report_{{order_id}}.xlsx
\`\`\`

Combined with **Group By**, Setu generates one file per group. E.g., \`order_id\` values 101, 102, 103 create three separate files.

> **Tip:** File extension determines format — \`.xlsx\` for Excel, \`.csv\` for CSV.` },

  { id:"load-api", title:"API Load", category:"Load Steps", content:`# API Load

## Script Box Format

\`\`\`
retailers#{{delivery_branch_id}}
\`\`\`

Pushes data to the endpoint, parameterized per unique value.

## Singleton
Sends **one record at a time**. Use when the API expects individual records.

## Verbatim
Sends data **as-is** without layout parsing. Use when data is already correctly structured.` },

  { id:"load-db", title:"Database Load", category:"Load Steps", content:`# Database Load

Select connection + attach a **Layout** file. Script Box is not used.

## How It Works

1. Select a database connection
2. Attach a Layout file defining target schema
3. Setu maps data based on the layout

> **Tip:** Primary keys and diffing are only for DB loads. For API/SFTP, leave those rows null. See **Layouts** for details.` },

  { id:"load-email", title:"Email Load", category:"Load Steps", content:`# Email Load

| Field | What to Enter | Example |
|:------|:-------------|:--------|
| Subject | Email subject line | \`Daily Inventory Report - {{date}}\` |
| Receiver Address | Recipient email(s) | \`team@company.com\` |
| Body | Email message text | \`Please find attached the daily report.\` |
| Attachment | File name for attachment | \`inventory_report.xlsx\` |

Setu takes previous step data, converts to the format in the attachment name, and sends.` },

  { id:"load-custom-reports", title:"Custom Report Generation", category:"Load Steps", content:`# Custom Report Generation

Generate formatted Excel reports using Jinja-style templates. Enable **"Generate Custom Report"** and upload a template.

## Template Structure

| Sheet | Name | Purpose |
|:------|:-----|:--------|
| Sheet 1 | Header | Report-level info + \`{{placeholders}}\` |
| Sheet 2 | Footer | Summary + \`{{placeholders}}\` |
| Sheet 3 | Table Contents | Column headers + \`{{column_name}}\` per row |

## Placeholder Syntax

\`\`\`
Header:  Driver: {{driver_name}}   Date: {{report_date}}
Footer:  Verified by: {{verified_by}}
Table:   {{order_id}}  {{customer}}  {{total_amount}}
\`\`\`

Design the template once — no code needed. Works with Multi-File and Multi-Sheet.` },

  { id:"load-multi-file-sheet", title:"Multi-File vs Multi-Sheet", category:"Load Steps", content:`# Multi-File vs Multi-Sheet

| Option | Result | When to Use |
|:-------|:-------|:------------|
| MULTI_FILE | One workbook per group | Each group goes to different recipient |
| MULTI_SHEET | One workbook, one sheet per group | All groups in a single file |

Both use **Group By** key. E.g., group by \`delivery_no\` → one file/sheet per delivery number.

## Prefix and Suffix

For Multi-Sheet, add prefix \`DDSR-\` → sheets: \`DDSR-DEL001\`, \`DDSR-DEL002\`, etc.

> **Note:** Different from **Bundle** (Transform feature for combining table outputs).` },

  // ── Layouts ──
  { id:"layouts-overview", title:"What is a Layout?", category:"Layouts", content:`# What is a Layout?

A **Layout** is an Excel file that maps, types, and validates data before loading into the target system. It provides a comprehensive framework for not only parsing and transforming data but also for managing critical database operations, ensuring data quality, and maintaining data integrity throughout the ingestion lifecycle.

## What a Layout Contains

- **Column names** from the previous step
- **Target data types** for each column
- **Validation rules** (required fields, patchable flags, min/max bounds)
- **Primary keys and diffing configuration** for database loads
- **UUID/hash generation** for establishing primary or foreign keys

## How It Works

1. Data from the previous step is converted based on layout definitions
2. Only columns defined in the layout are loaded — anything else is ignored
3. Data types are enforced per specification
4. Validation rules are checked — breaching min/max thresholds triggers an error during loading
5. For database loads, diffing logic determines whether to insert new rows or update existing ones

## Beyond Basic Type Conversion

Layouts are also instrumental when new rows are being ingested into a database and a UUID of a hash datatype needs to be generated. This is particularly crucial for establishing primary or foreign keys, ensuring data integrity and uniqueness within the database.

## Why Layouts Matter

- Correct data types across all columns
- No schema mismatches between source and target
- Control exactly what data gets sent or stored
- Define update behavior (which fields can be patched)
- Prevent ingestion of erroneous or out-of-range values
- Ensure all critical fields are consistently provided
- Intelligent insert-or-update logic via diffing` },

{ id:"layouts-column-types", title:"Column Types", category:"Layouts", content:`# Column Types

| Type | Description | Example |
|:-----|:-----------|:--------|
| \`string\` | Plain text | \`"ORD-12345"\` |
| \`stringorempty\` | Text or empty | \`""\` or \`"active"\` |
| \`integer\` | Whole numbers | \`42\` |
| \`float\` | Decimals | \`3.14\` |
| \`boolean\` | True/false | \`true\` |
| \`date\` | Date only | \`"2025-01-15"\` |
| \`datetime\` | Date + time | \`"2025-01-15T10:30:00"\` |
| \`datetimezone\` | Date + time + timezone | \`"2025-01-15T10:30:00+05:30"\` |
| \`object\` | JSON data | \`{"key": "value"}\` |
| \`hash\` | Computed hash of source columns | Defined in \`value\` field — used for generating UUIDs as primary or foreign keys |

## Column-Level Fields

| Field | Meaning |
|:------|:--------|
| **name** | Column name in target |
| **type** | Data type |
| **description** | Optional notes |
| **value** | Default or computed value (e.g., for hash columns, a list of source columns like \`["col1", "col2"]\`) |
| **required** | TRUE = mandatory — load fails if this field is missing or null |
| **patchable** | TRUE = updatable on existing records. FALSE = original value preserved on updates, and value cannot be set to NULL |
| **minimum** | Optional lower bound — incoming data breaching this threshold triggers an error during loading |
| **maximum** | Optional upper bound — same validation behavior as minimum |

## Mandatory vs Non-Mandatory Fields

Layouts allow clear designation of fields as either mandatory or non-mandatory via the **required** flag. When set to TRUE, the field must be present and non-null in every record — if missing, the load step fails. This ensures all critical fields are consistently provided, enhancing data quality and completeness, while offering flexibility for optional data points that can be left empty.` },

{ id:"layouts-primary-keys", title:"Primary Keys & Diffing", category:"Layouts", content:`# Primary Keys & Diffing

## Special Rows

| Row | Purpose | Example |
|:----|:--------|:--------|
| \`$primary_keys\` | Unique identifier(s) | \`["outlet_id"]\` |
| \`$primary_condition\` | Condition for key matching | — |
| \`$primary_partial\` | Partial key matching | TRUE/FALSE |
| \`$diffing_enabled\` | Smart insert/update | TRUE/FALSE |

## Primary Keys

Primary keys are fundamental identifiers, only required when data is intended to be added to a database. They uniquely identify each record, preventing duplication and ensuring data consistency. For cases where a natural key doesn't exist, use a \`hash\` type column in the layout to generate a UUID from one or more source columns — this is especially useful for establishing primary or foreign keys automatically.

## How Diffing Works

Diffing is a sophisticated feature that enables intelligent data updates. When new data arrives, the diffing process determines what to do:

- If the record is **new** (no matching primary key exists) → **insert** it
- If the record **already exists** (matched by primary key) → **update** it

This optimizes storage and maintains data freshness — no duplicated records, and existing data stays up to date.

## Patchable Fields

When a record is updated via diffing, the **patchable** flag controls which fields get modified:

- \`patchable: TRUE\` → field is updated with the new value. Importantly, this prevents the value from being updated to NULL — an explicitly set new value remains effective and isn't inadvertently cleared.
- \`patchable: FALSE\` → original value is preserved, regardless of what the incoming data contains.

## Validation

Layouts integrate validation capabilities through **minimum** and **maximum** bounds on numeric fields. If incoming data breaches these predefined thresholds, an error is triggered during the loading process, preventing ingestion of erroneous or out-of-range values.

> **Tip:** Primary keys, diffing, and patchable flags are only relevant for **database loads**. For API or SFTP loads, these rows can be left null.` },
  // ── Routine Configuration ──
  { id:"config-basics", title:"Title, Description & Metadata", category:"Routine Configuration", content:`# Title, Description & Metadata

## Title
Routine name. Be descriptive.

## Description
Short explanation. Useful for documentation.

## Sender / Receiver
Source and destination system names. Optional, for documentation.

## Priority Search Keys
Comma-separated list of important payload fields. Used for prioritization.` },

  { id:"config-permissions", title:"Permissions", category:"Routine Configuration", content:`# Permissions

> **If permissions are not set, the routine is invisible to all users — even with node access.**

Ensure all team members who need access are explicitly granted permission.` },


  { id:"config-priority", title:"Priority", category:"Routine Configuration", content:`# Priority

| Level | Use Case | Example |
|:------|:---------|:--------|
| **High** | Real-time tasks | Stream processing |
| **Medium** | Regular syncing | Hourly transactional data |
| **Low** | Heavy operations | Daily master data sync |

Hidden when Awaited is on (always highest priority).` },

{ id:"routine-triggers", title:"Routine Triggers", category:"Routine Configuration", content:`# Routine Triggers

Routines are categorized by their initiation mechanisms — or "triggers." These determine when and how a routine executes, influencing its behavior and interaction with other system components.

## Scheduled (Time-based) Triggers

These routines are initiated at predetermined intervals or specific times. They operate independently of external events and are designed for tasks that need to occur regularly.

Scheduled routines are inherently **asynchronous** — once triggered, they run in the background without immediately returning a result or blocking other processes. The system does not wait for a scheduled routine to complete before proceeding. Examples include nightly data backups, weekly report generation, or daily system health checks. Their execution is fire-and-forget, with results logged or made available for later retrieval.

> **See also:** Schedule (Cron) for details on configuring cron expressions.

## Event-Triggered (Webhooks)

These routines are initiated in response to specific events occurring within or outside the system. When a defined event takes place, a webhook sends an HTTP POST request to a specified URL, triggering the corresponding routine.

Webhook-triggered routines are further divided based on their synchronization behavior:

### Awaited (Synchronous)

The calling system **waits** for the routine to complete and return a response before proceeding. This is crucial for operations where the outcome is required immediately — such as processing a payment confirmation or validating user input. The calling service is blocked until the routine finishes, ensuring sequential execution and enabling immediate feedback.

- Total execution capped at **60 seconds**
- Routine gets higher execution priority
- Retries happen in real time with **1–10 second** backoff

> **Critical: If using Python to receive Postman data, Awaited must be OFF.** SQL works with both.

### Non-Awaited (Asynchronous)

The calling system **does not wait** for completion. Once triggered, the routine begins execution but the initiating service receives an immediate acknowledgment and proceeds with its own operations. Suitable for tasks that can be processed independently — such as sending email notifications, updating external logging systems, or initiating long-running background processes.` },

{ id:"config-schedule", title:"Schedule (Cron)", category:"Routine Configuration",image: "Cron.png", content:`# Schedule (Cron)

Cron expressions in **UTC**. Setu shows **IST** equivalent. Each run creates an **Episode**.

| Cron | Meaning |
|:-----|:--------|
| \`0 */2 * * *\` | Every 2 hours |
| \`30 6 * * *\` | Daily at 6:30 AM UTC |
| \`0 0 * * 1\` | Every Monday at midnight UTC |
| \`*/15 * * * *\` | Every 15 minutes |

> **Tip:** 12:00 PM IST = 6:30 AM UTC.` },

  { id:"config-awaited", title:"Awaited Mode", category:"Routine Configuration", content:`# Awaited Mode

Runs **immediately** and returns a response. Calling system waits for success/failure.

## When Enabled

- Higher execution priority
- Priority option hidden
- **60 second** max execution
- Enable **Awaited Retries** (1–10 second backoff)

> **Critical: Python + Postman data → Awaited must be OFF.** SQL works with both.` },

  // ── Routine Migration ──
  { id:"migration-export", title:"Export Process", category:"Routine Migration",image: "Migration.png", content:`# Export Process

1. **Select the node** with the routine(s)
2. **Click Export**
3. **Select routine(s)** — single or multiple
4. **Choose options:**

| Option | Description |
|:-------|:-----------|
| Include Layouts | Layout files |
| Include Schedules (default) | Scheduling config |
| Include Email Connector Attributes | Email connector configs |
| Include Email Error Attributes | Error notification emails |
| Include Permissions (default) | Access control |

5. **Click "Export to JSON"** — generates the file.` },

  { id:"migration-import", title:"Import Process", category:"Routine Migration", image: "Migration-Import.png",content:`# Import Process

1. **Select target node**
2. **Click Import**
3. **Upload exported JSON**
4. **Choose options:**

| Option | Description |
|:-------|:-----------|
| Override Existing Routines | Replace same-name routines |
| Link Connections (default) | Reuse target node connections |
| Link Layouts | Link to existing layouts |
| Override Layouts | Replace with imported layouts |

5. **Click "Import Routines"**

Validation: hardcoded values unchanged, connections verified.` },

  { id:"migration-json-format", title:"Export JSON Reference", category:"Routine Migration", content:`# Export JSON Reference

\`\`\`json
{ "metadata": {...}, "routines": [...], "layouts": null | [...] }
\`\`\`

## Metadata

| Field | Example |
|:------|:--------|
| \`export_timestamp\` | \`"2026-02-27T10:21:09.813445+00:00"\` |
| \`source_node_name\` | \`"mars"\` |
| \`version\` | \`"0.59.0-beta"\` |

## Routine Fields

| Field | Notes |
|:------|:------|
| \`awaited\` | \`true\` = 60s max |
| \`schedule\` | \`""\` = manual only |
| \`permission\` | \`null\` = invisible |
| \`priority\` | default: \`"default"\` |
| \`awaited_backoff\` | default: 5 seconds |` },

  // ── Common Patterns ──
  { id:"pattern-basic-etl", title:"Basic ETL", category:"Common Patterns", content:`# Basic ETL

The most common routine structure: pull data, clean it, push it out.

| Step | Type | Script |
|:-----|:-----|:-------|
| 1 | Extract (DB) | \`SELECT * FROM orders WHERE date >= '2025-01-01'\` |
| 2 | Transform (SQL) | \`SELECT order_id, amount, UPPER(status) AS status FROM table_1 WHERE amount > 0\` |
| 3 | Load (SFTP) | \`/outbound/clean_orders.xlsx\` |` },

  { id:"pattern-multi-source", title:"Multi-Source Merge", category:"Common Patterns", content:`# Multi-Source Merge

| Step | Type | Script |
|:-----|:-----|:-------|
| 1 | Extract (DB) | \`SELECT order_id, customer_id, amount FROM orders\` |
| 2 | Extract (API) | \`/json_apis/getCustomers?active=true\` |
| 3 | Transform (SQL) | \`SELECT a.order_id, b.customer_name, a.amount FROM table_1 a LEFT JOIN table_2 b ON a.customer_id = b.id\` |
| 4 | Load (Email) | Attachment: \`merged_report.xlsx\` |` },

  { id:"pattern-dynamic-query", title:"Dynamic Query via Python", category:"Common Patterns", content:`# Dynamic Query via Python

Build parameterized queries in a Python Transform **before** the Extract.

## Hardcoded Dates

\`\`\`python
def transform():
    import pandas as pd
    query = f"""SELECT * FROM orders
        WHERE date BETWEEN '2025-01-01' AND '2025-06-30'"""
    return pd.DataFrame({'query': [query]})
\`\`\`

## From Upstream Table

\`\`\`python
def transform(table_1):
    import pandas as pd
    start = table_1['start_date'].iloc[0]
    end = table_1['end_date'].iloc[0]
    query = f"""SELECT * FROM orders
        WHERE created_at BETWEEN '{start}' AND '{end}'"""
    return pd.DataFrame({'query': [query]})
\`\`\`

> **Why Triple Quotes?** Multi-line strings with embedded quotes. Combined with f-strings for clean variable injection.` },

  { id:"pattern-postman-ingest", title:"Postman Data Ingestion", category:"Common Patterns", content:`# Postman Data Ingestion

External data available as \`file_1\` (not \`table_1\`).

**SQL:** \`SELECT * FROM file_1\`

**Python:** \`def transform(file_1): return file_1\`

- Python + Postman → **Awaited must be OFF**
- SQL works with both modes` },

  { id:"pattern-json-api", title:"JSON for API Loads", category:"Common Patterns", content:`# JSON for API Loads

\`\`\`python
def transform(table_1):
    import pandas as pd, json
    records = table_1.to_dict(orient='records')
    return pd.DataFrame({'payload': [json.dumps(records)]})
\`\`\`

Or enable **Singleton** in the Load step to send one record at a time automatically.` },

  { id:"pattern-sleep", title:"Using sleep() for Delays", category:"Common Patterns", content:`# Using sleep() for Delays

\`\`\`python
import time

def transform(table_1):
    time.sleep(5)  # 5 second pause
    return table_1
\`\`\`

- \`import time\` goes **outside** the function (exception to the rule)
- Delay counts toward step's total Timeout` },

  { id:"pattern-grouped-output", title:"Grouped File Output", category:"Common Patterns", content:`# Grouped File Output

1. Set **Group By** key (e.g., \`delivery_no\`) in Load step
2. Use Jinja in file path: \`/outbound/delivery_{{delivery_no}}.xlsx\`

Result: one file per group — \`delivery_DEL001.xlsx\`, \`delivery_DEL002.xlsx\`, etc.

Works with Custom Report templates for formatted per-group reports.` },

  // ── Error Reference ──
  { id:"error-codes", title:"HTTP Status Codes", category:"Error Reference", content:`# HTTP Status Codes

## Success

| Code | Meaning |
|:-----|:--------|
| **200** | OK |
| **201** | Created |
| **204** | No Content |

## Client Errors

| Code | Meaning | Cause |
|:-----|:--------|:------|
| **400** | Bad Request | Syntax error, missing params |
| **401** | Unauthorized | Bad credentials → escalate to DevOps |
| **403** | Forbidden | Permission issue |
| **404** | Not Found | Wrong endpoint or path |

## Server Errors

| Code | Meaning | Cause |
|:-----|:--------|:------|
| **500** | Internal Error | Target crashed or unhandled error |
| **501** | Service Unavailable | Server down |
| **503** | Service Unavailable | Maintenance or overloaded |` },

  { id:"error-debugging", title:"Debugging Tips", category:"Error Reference", content:`# Debugging Tips

## Extract Errors

- **DB:** Check SQL syntax. Verify connection.
- **API:** Check endpoint, method, params. Is API reachable?
- **SFTP:** Check file path. File may not exist.

## Transform Errors

- **SQL:** Check \`table_N\` references. Step insertion shifts numbering → use Step Code.
- **Python:** Check function signature, imports inside function, returns DataFrame.
- **Common:** \`file_1\` (Postman data) vs \`table_1\` (step output) confusion.

## Load Errors

- **API:** Enable Singleton for single-record APIs. Check Layout. Use Verbatim for pre-formatted data.
- **DB:** Schema mismatch → check Layout file.
- **SFTP:** Check path. Verify Group By if using Jinja placeholders.
- **Email:** Check all address fields and attachment name.

## From Export JSON

- **Step failing?** Check \`timeout\` — might need more than 10 min.
- **No retries?** Check \`retries\` > 0 and backoff isn't too long.
- **Wrong data in Load?** Load uses **immediately previous** step output.
- **Nobody can see routine?** \`permission\` is null → invisible to all.` },

  // ── UI & Tools ──
  { id:"ui-downloads", title:"Downloads", category:"UI & Tools", content:`# Downloads

Download output data from any step. Located in **top-right** of step header. Useful for debugging, verification, and getting local copies.` },

  { id:"ui-duration", title:"Duration", category:"UI & Tools", content:`# Duration

Shows step execution time. Located in **top-right** of step header. Identify slow steps and decide whether to increase Timeout.` },

  { id:"ui-help", title:"Built-in Help", category:"UI & Tools", content:`# Built-in Help

Step-specific guidance via the **?** icon in the step header. Content varies by step type (Extract, Transform, Load). Built-in guide — no need to leave the app.` },

  { id:"ui-datewise", title:"Datewise View", category:"UI & Tools",image: "Datewise.png", content:`# Datewise View

Track execution history by date. Every run creates an Episode. Datewise shows all episodes per day with status, timing, and errors. Great for spotting patterns and auditing.` },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
const categories = (() => {
  const seen = new Map();
  docs.forEach(d => { if (!seen.has(d.category)) seen.set(d.category, []); seen.get(d.category).push(d); });
  return [...seen.entries()].map(([name, items]) => ({ name, items }));
})();

const allIds = docs.map(d => d.id);

// ═══════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════
function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{margin:"16px 0",borderRadius:8,overflow:"hidden",border:"1px solid var(--border)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 12px",background:"var(--code-header)",fontSize:11,fontFamily:"var(--font-mono)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text-dim)"}}>
        <span>{lang||"code"}</span>
        <button onClick={copy} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-dim)",display:"flex",alignItems:"center",gap:4,fontSize:11,fontFamily:"var(--font-mono)"}}>
          {copied?<><I.Check size={12}/>copied</>:<><I.Copy size={12}/>copy</>}
        </button>
      </div>
      <pre style={{margin:0,padding:"14px 16px",background:"var(--code-bg)",overflowX:"auto",fontSize:13,lineHeight:1.6,fontFamily:"var(--font-mono)",color:"var(--text-code)"}}><code>{code}</code></pre>
    </div>
  );
}

function HeroImage({ filename, caption }) {
  const [err, setErr] = useState(false);
  const src = `/screenshots/${filename}`;
  if (err) return (
    <div style={{margin:"0 0 24px",borderRadius:10,border:"2px dashed var(--border)",padding:32,textAlign:"center",background:"var(--img-bg)"}}>
      <I.Img size={32}/><div style={{marginTop:8,fontSize:13,color:"var(--text-dim)",fontFamily:"var(--font-mono)"}}>{filename}</div>
      {caption&&<div style={{marginTop:8,fontSize:13,color:"var(--text-secondary)"}}>{caption}</div>}
    </div>
  );
  return (
    <figure style={{margin:"0 0 24px"}}>
      <img src={src} alt={caption||filename} onError={()=>setErr(true)} style={{width:"100%",display:"block",borderRadius:10,border:"1px solid var(--border)"}}/>
      {caption&&<figcaption style={{marginTop:6,padding:"8px 14px",borderRadius:"0 0 8px 8px",fontSize:13,color:"var(--text-secondary)",background:"var(--img-caption-bg)",fontFamily:"var(--font-body)"}}>{caption}</figcaption>}
    </figure>
  );
}

function renderMd(text) {
  if (!text) return null;
  const lines = text.trim().split("\n"), els = [];
  let i = 0, k = 0;

  const inl = str => {
    // links
    const parts = [];
    let rest = str;
    const linkRx = /\[([^\]]+)\]\(([^)]+)\)/g;
    let m, last = 0;
    while ((m = linkRx.exec(str)) !== null) {
      if (m.index > last) parts.push({ t:"t", v:str.slice(last,m.index) });
      parts.push({ t:"a", text:m[1], href:m[2] });
      last = m.index + m[0].length;
    }
    if (last < str.length) parts.push({ t:"t", v:str.slice(last) });
    if (!parts.length) parts.push({ t:"t", v:str });

    return parts.flatMap((p,pi) => {
      if (p.t === "a") return [<a key={pi} href={p.href} target="_blank" rel="noreferrer" style={{color:"var(--accent)",textDecoration:"none"}} onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"} onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{p.text}</a>];
      // code then bold
      const codeRx = /`([^`]+)`/g;
      let cl=0, cm, cp=[];
      while((cm=codeRx.exec(p.v))!==null){
        if(cm.index>cl) cp.push({t:"t",v:p.v.slice(cl,cm.index)});
        cp.push({t:"c",v:cm[1]}); cl=cm.index+cm[0].length;
      }
      if(cl<p.v.length) cp.push({t:"t",v:p.v.slice(cl)});
      if(!cp.length) cp.push({t:"t",v:p.v});
      return cp.map((c,ci)=>{
        if(c.t==="c") return <code key={`${pi}-${ci}`} style={{background:"var(--inline-code-bg)",color:"var(--accent)",padding:"2px 6px",borderRadius:4,fontSize:13,fontFamily:"var(--font-mono)",fontWeight:500}}>{c.v}</code>;
        const bp=c.v.split(/\*\*(.+?)\*\*/g);
        return bp.map((b,bi)=>bi%2===1?<strong key={`${pi}-${ci}-${bi}`} style={{fontWeight:600,color:"var(--text-primary)"}}>{b}</strong>:<span key={`${pi}-${ci}-${bi}`}>{b}</span>);
      });
    });
  };

  while (i < lines.length) {
    const ln = lines[i];

    // Code block
    if (ln.trim().startsWith("```")) {
      const lang = ln.trim().slice(3); const cl=[]; i++;
      while(i<lines.length&&!lines[i].trim().startsWith("```")){cl.push(lines[i]);i++;} i++;
      els.push(<CodeBlock key={k++} lang={lang} code={cl.join("\n")}/>);
      continue;
    }

    // Table
    if (ln.includes("|")&&ln.trim().startsWith("|")) {
      const tl=[]; while(i<lines.length&&lines[i].includes("|")&&lines[i].trim().startsWith("|")){tl.push(lines[i]);i++;}
      if(tl.length>=2){
        const pr=r=>r.split("|").slice(1,-1).map(c=>c.trim());
        const hd=pr(tl[0]),dr=tl.slice(2).map(pr);
        els.push(
          <div key={k++} style={{margin:"16px 0",overflowX:"auto",borderRadius:8,border:"1px solid var(--border)"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,fontFamily:"var(--font-body)"}}>
              <thead><tr>{hd.map((h,hi)=><th key={hi} style={{textAlign:"left",padding:"10px 14px",background:"var(--code-header)",color:"var(--text-dim)",fontWeight:600,fontSize:13,borderBottom:"2px solid var(--border)"}}>{inl(h)}</th>)}</tr></thead>
              <tbody>{dr.map((r,ri)=><tr key={ri}>{r.map((c,ci)=>{
                const isMono=c.startsWith("`");
                return <td key={ci} style={{padding:"9px 14px",borderBottom:"1px solid var(--border)",color:"var(--text-secondary)",fontFamily:isMono?"var(--font-mono)":"inherit"}}>{inl(c)}</td>;
              })}</tr>)}</tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Headings — skip H1 (rendered separately)
    if(ln.startsWith("# ")&&!ln.startsWith("## ")){i++;continue;}
    if(ln.startsWith("## ")){els.push(<h2 key={k++} style={{fontSize:22,fontWeight:600,color:"var(--text-primary)",margin:"32px 0 12px",letterSpacing:"-0.01em",fontFamily:"var(--font-heading)"}}>{inl(ln.slice(3))}</h2>);i++;continue;}
    if(ln.startsWith("### ")){els.push(<h3 key={k++} style={{fontSize:17,fontWeight:600,color:"var(--text-primary)",margin:"24px 0 8px",fontFamily:"var(--font-heading)"}}>{inl(ln.slice(4))}</h3>);i++;continue;}

    // Blockquote
    if(ln.trim().startsWith("> ")){
      const ql=[]; while(i<lines.length&&lines[i].trim().startsWith("> ")){ql.push(lines[i].trim().slice(2));i++;}
      els.push(<div key={k++} style={{display:"flex",margin:"16px 0",background:"var(--callout-bg)",borderRadius:"0 6px 6px 0",borderLeft:"3px solid var(--accent)",padding:"12px 16px",gap:12}}>
        <div style={{fontSize:15,lineHeight:1.7,color:"var(--text-secondary)",fontFamily:"var(--font-body)"}}>{ql.map((q,qi)=><p key={qi} style={{margin:qi?"8px 0 0":0}}>{inl(q)}</p>)}</div>
      </div>);
      continue;
    }

    // Unordered list (custom accent dots)
    if(ln.trim().startsWith("- ")){
      const it=[]; while(i<lines.length&&lines[i].trim().startsWith("- ")){it.push(lines[i].trim().slice(2));i++;}
      els.push(<ul key={k++} style={{margin:"8px 0 14px",paddingLeft:0,listStyle:"none"}}>
        {it.map((x,xi)=><li key={xi} style={{display:"flex",gap:10,margin:"6px 0",color:"var(--text-secondary)",fontSize:15,lineHeight:1.7,fontFamily:"var(--font-body)"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",marginTop:10,flexShrink:0}}/><span>{inl(x)}</span>
        </li>)}
      </ul>);
      continue;
    }

    // Ordered list (accent circles)
    if(/^\d+\.\s/.test(ln.trim())){
      const it=[]; while(i<lines.length&&/^\d+\.\s/.test(lines[i].trim())){it.push(lines[i].trim().replace(/^\d+\.\s/,""));i++;}
      els.push(<ol key={k++} style={{margin:"8px 0 14px",paddingLeft:0,listStyle:"none",counterReset:"ol"}}>
        {it.map((x,xi)=><li key={xi} style={{display:"flex",gap:10,margin:"6px 0",color:"var(--text-secondary)",fontSize:15,lineHeight:1.7,fontFamily:"var(--font-body)"}}>
          <span style={{width:24,height:24,borderRadius:"50%",background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,marginTop:2,fontFamily:"var(--font-mono)"}}>{xi+1}</span><span>{inl(x)}</span>
        </li>)}
      </ol>);
      continue;
    }

    if(ln.trim()===""){i++;continue;}
    els.push(<p key={k++} style={{margin:"0 0 14px",color:"var(--text-secondary)",fontSize:15,lineHeight:1.7,fontFamily:"var(--font-body)"}}>{inl(ln)}</p>);
    i++;
  }
  return els;
}

// Get the H1 title from content (first # heading)
function getContentTitle(content) {
  const m = content.match(/^#\s+(.+)/m);
  return m ? m[1] : "";
}

// ═══════════════════════════════════════════════════════════
// RELEASE NOTES DRAWER
// ═══════════════════════════════════════════════════════════
function ReleaseDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(0);
  useEffect(()=>{if(open)setExpanded(0);},[open]);
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    if(open)window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[open,onClose]);

  if(!open) return null;
  return <>
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"var(--overlay)",zIndex:200,transition:"opacity 0.3s"}}/>
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:400,maxWidth:"90vw",background:"var(--bg)",borderLeft:"1px solid var(--border)",zIndex:201,display:"flex",flexDirection:"column",boxShadow:"-8px 0 30px rgba(0,0,0,0.1)",transition:"right 0.3s cubic-bezier(0.4,0,0.2,1)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"20px 24px 16px",borderBottom:"1px solid var(--border)"}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text-primary)",fontFamily:"var(--font-heading)"}}>Release Notes</div>
          <div style={{fontSize:13,color:"var(--text-dim)",marginTop:2,fontFamily:"var(--font-body)"}}>Setu ETL Platform</div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-dim)",padding:4}}><I.X size={18}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
        {RELEASE_NOTES.map((rn,ri)=>{
          const isOpen=expanded===ri;
          const isLatest=ri===0;
          return <div key={ri} style={{marginBottom:8,borderRadius:8,border:`1px solid ${isOpen?"var(--accent)":"var(--border)"}`,overflow:"hidden",background:isOpen?"var(--accent-dim)":"transparent",transition:"all 0.2s"}}>
            <button onClick={()=>setExpanded(isOpen?-1:ri)} style={{display:"flex",alignItems:"center",width:"100%",padding:"12px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font-body)",gap:8}}>
              <span style={{transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0)",color:"var(--text-dim)"}}><I.ChevDown size={14}/></span>
              <span style={{flex:1}}>
                <span style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",fontFamily:"var(--font-heading)"}}>v{rn.version}</span>
                <span style={{fontSize:12,color:"var(--text-dim)",marginLeft:8}}>{rn.sections.length} update{rn.sections.length!==1?"s":""}</span>
              </span>
              {isLatest&&<span style={{fontSize:10,fontWeight:700,color:"var(--tag-latest-text)",background:"var(--tag-latest-bg)",padding:"2px 8px",borderRadius:10,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:"var(--font-mono)"}}>Latest</span>}
            </button>
            {isOpen&&<div style={{padding:"4px 16px 16px 38px"}}>
              {rn.sections.map((s,si)=><div key={si} style={{marginBottom:si<rn.sections.length-1?12:0}}>
                <div style={{fontSize:14,fontWeight:600,color:"var(--text-primary)",marginBottom:4,fontFamily:"var(--font-heading)"}}>{s.title}</div>
                <div style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.6,fontFamily:"var(--font-body)"}}>{s.body}</div>
              </div>)}
            </div>}
          </div>;
        })}
      </div>
    </div>
  </>;
}

// ═══════════════════════════════════════════════════════════
// SEARCH MODAL
// ═══════════════════════════════════════════════════════════
function SearchModal({ open, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(()=>{if(open){setQ("");setTimeout(()=>ref.current?.focus(),50);}}, [open]);
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape")onClose();};
    if(open)window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[open,onClose]);

  const results = useMemo(()=>{
    if(!q.trim()) return [];
    const ql=q.toLowerCase();
    return docs.filter(d=>d.title.toLowerCase().includes(ql)||d.category.toLowerCase().includes(ql)||d.content.toLowerCase().includes(ql)).slice(0,8);
  },[q]);

  if(!open) return null;
  return <>
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"var(--overlay)",zIndex:300}}/>
    <div style={{position:"fixed",top:"15vh",left:"50%",transform:"translateX(-50%)",width:560,maxWidth:"90vw",background:"var(--search-bg)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",zIndex:301,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
      <div style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:10,borderBottom:"1px solid var(--border)"}}>
        <I.Search size={16}/>
        <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&results.length){onSelect(results[0].id);onClose();}}}
          placeholder="Search documentation..." style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--text-primary)",fontSize:15,fontFamily:"var(--font-body)"}}/>
        <span onClick={onClose} style={{fontSize:11,color:"var(--text-dim)",background:"var(--code-bg)",padding:"2px 8px",borderRadius:4,cursor:"pointer",fontFamily:"var(--font-mono)",border:"1px solid var(--border)"}}>ESC</span>
      </div>
      {results.length>0&&<div style={{maxHeight:340,overflowY:"auto"}}>
        {results.map(r=><div key={r.id} onClick={()=>{onSelect(r.id);onClose();}} style={{padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid var(--border)",transition:"background 0.1s"}}
          onMouseEnter={e=>e.currentTarget.style.background="var(--bg-hover)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{fontSize:11,color:"var(--text-dim)",textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"var(--font-mono)"}}>{r.category}</div>
          <div style={{fontSize:14,fontWeight:500,color:"var(--text-primary)",fontFamily:"var(--font-body)"}}>{r.title}</div>
        </div>)}
      </div>}
      {q&&!results.length&&<div style={{padding:24,textAlign:"center",color:"var(--text-dim)",fontSize:13}}>No results found</div>}
    </div>
  </>;
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("what-is-setu");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState(()=>{
    const m={}; categories.forEach(c=>m[c.name]=false); return m;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);

  const theme = darkMode ? DARK : LIGHT;
  const doc = docs.find(d=>d.id===activePage);
  const ci = allIds.indexOf(activePage);
  const prev = ci>0?docs[ci-1]:null;
  const next = ci<docs.length-1?docs[ci+1]:null;

  const nav = id => {
    setActivePage(id);
    setSidebarOpen(false);
    // expand parent category
    const d=docs.find(x=>x.id===id);
    if(d) setExpandedCats(p=>({...p,[d.category]:true}));
    if(contentRef.current) contentRef.current.scrollTop=0;
  };

  // Keyboard shortcuts
  useEffect(()=>{
    const h=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearchOpen(v=>!v);}
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[]);

  // Scroll listener for scroll-to-top
  useEffect(()=>{
    const el=contentRef.current;
    if(!el) return;
    const h=()=>setShowScrollTop(el.scrollTop>300);
    el.addEventListener("scroll",h);
    return ()=>el.removeEventListener("scroll",h);
  },[]);

  const pageTitle = doc ? getContentTitle(doc.content) || doc.title : "";

  return (
    <div style={{...theme,background:"var(--bg)",color:"var(--text-secondary)",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",fontSize:15,lineHeight:1.7,fontFamily:"var(--font-body)"}}>

      <SearchModal open={searchOpen} onClose={()=>setSearchOpen(false)} onSelect={nav}/>
      <ReleaseDrawer open={releaseNotesOpen} onClose={()=>setReleaseNotesOpen(false)}/>

      {/* ── HEADER ── */}
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",height:56,borderBottom:"1px solid var(--border)",background:"var(--bg-sidebar)",flexShrink:0,zIndex:100,gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-dim)",padding:4,display:"flex",alignItems:"center"}}><I.Menu size={20}/></button>
          <div style={{width:28,height:28,borderRadius:6,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"var(--font-mono)"}}>S</div>
          <span style={{fontWeight:600,fontSize:15,color:"var(--text-primary)",letterSpacing:"-0.01em",fontFamily:"var(--font-heading)"}}>Setu Docs</span>
          <span style={{fontSize:11,color:"var(--text-dim)",background:"var(--code-bg)",padding:"2px 8px",borderRadius:4,fontFamily:"var(--font-mono)",fontWeight:600}}>v0.60.2</span>
        </div>

        <button onClick={()=>setSearchOpen(true)} style={{display:"flex",alignItems:"center",gap:10,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 14px",cursor:"pointer",minWidth:200,justifyContent:"space-between",fontFamily:"var(--font-body)",fontSize:13,color:"var(--text-dim)",transition:"border-color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
          <span style={{display:"flex",alignItems:"center",gap:6}}><I.Search size={14}/>Search</span>
          <span style={{fontSize:11,background:"var(--code-bg)",padding:"1px 6px",borderRadius:4,fontFamily:"var(--font-mono)",border:"1px solid var(--border)"}}>⌘K</span>
        </button>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setReleaseNotesOpen(true)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"var(--accent)",fontSize:13,fontWeight:500,padding:"6px 10px",borderRadius:6,fontFamily:"var(--font-body)",transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--accent-dim)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <I.Bell size={14}/><span>v{RELEASE_NOTES[0].version}</span>
          </button>
          <button onClick={()=>setDarkMode(!darkMode)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-dim)",padding:6,borderRadius:6,display:"flex",alignItems:"center",transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg-hover)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {darkMode?<I.Sun size={18}/>:<I.Moon size={18}/>}
          </button>
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* ── SIDEBAR ── */}
        <nav style={{width:sidebarOpen?260:260,minWidth:260,background:"var(--bg-sidebar)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0}}>
          <div style={{padding:"12px 0"}}>
            {categories.map(cat=>(
              <div key={cat.name} style={{marginBottom:2}}>
                <button onClick={()=>setExpandedCats(p=>({...p,[cat.name]:!p[cat.name]}))} style={{display:"flex",alignItems:"center",width:"100%",padding:"8px 16px",background:"none",border:"none",cursor:"pointer",gap:6,textAlign:"left",fontFamily:"var(--font-body)",transition:"background 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg-hover)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{transition:"transform 0.15s",transform:expandedCats[cat.name]?"rotate(90deg)":"rotate(0)",color:"var(--text-dim)"}}><I.ChevRight size={12}/></span>
                  <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-dim)"}}>{cat.name}</span>
                </button>
                {expandedCats[cat.name]&&<div style={{paddingBottom:4}}>
                  {cat.items.map(item=>{
                    const active=activePage===item.id;
                    return <button key={item.id} onClick={()=>nav(item.id)} style={{display:"block",width:"100%",padding:"6px 16px 6px 34px",background:active?"var(--accent-dim)":"none",border:"none",borderRight:active?"2px solid var(--accent)":"2px solid transparent",color:active?"var(--accent)":"var(--text-secondary)",fontSize:13.5,fontWeight:active?500:400,cursor:"pointer",textAlign:"left",fontFamily:"var(--font-body)",transition:"all 0.15s"}}
                      onMouseEnter={e=>{if(!active)e.currentTarget.style.background="var(--bg-hover)";}}
                      onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
                      {item.title}
                    </button>;
                  })}
                </div>}
              </div>
            ))}
          </div>
        </nav>

        {/* ── CONTENT ── */}
        <main ref={contentRef} style={{flex:1,overflowY:"auto",padding:"40px 48px 80px",background:"var(--bg)",position:"relative"}}>
          {doc&&<article style={{maxWidth:760,margin:"0 auto"}}>
            {/* Breadcrumb */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16,fontSize:12,fontFamily:"var(--font-mono)",color:"var(--text-dim)"}}>
              <span style={{cursor:"pointer",display:"flex",alignItems:"center"}} onClick={()=>nav("what-is-setu")}><I.Home size={12}/></span>
              <span>/</span>
              <span>{doc.category}</span>
              <span>/</span>
              <span style={{color:"var(--text-secondary)"}}>{doc.title}</span>
            </div>

            {/* Title */}
            <h1 style={{fontSize:32,fontWeight:700,color:"var(--text-primary)",margin:"0 0 24px",letterSpacing:"-0.02em",lineHeight:1.3,fontFamily:"var(--font-heading)"}}>{pageTitle}</h1>

            {/* Hero image */}
            {doc.image&&<HeroImage filename={doc.image} caption={doc.imageCaption}/>}

            {/* Content */}
            <div>{renderMd(doc.content)}</div>

            {/* Prev / Next */}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:48,paddingTop:24,borderTop:"1px solid var(--border)",gap:16}}>
              {prev?<button onClick={()=>nav(prev.id)} style={{display:"flex",flexDirection:"column",gap:4,padding:"12px 18px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",textAlign:"left",minWidth:160,fontFamily:"var(--font-body)",transition:"border-color 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <span style={{fontSize:12,color:"var(--text-dim)"}}>← Previous</span>
                <span style={{fontSize:14,color:"var(--accent)",fontWeight:500}}>{prev.title}</span>
              </button>:<div/>}
              {next?<button onClick={()=>nav(next.id)} style={{display:"flex",flexDirection:"column",gap:4,padding:"12px 18px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",textAlign:"right",minWidth:160,fontFamily:"var(--font-body)",transition:"border-color 0.15s",alignItems:"flex-end"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <span style={{fontSize:12,color:"var(--text-dim)"}}>Next →</span>
                <span style={{fontSize:14,color:"var(--accent)",fontWeight:500}}>{next.title}</span>
              </button>:<div/>}
            </div>
          </article>}

          {/* Scroll to top */}
          {showScrollTop&&<button onClick={()=>contentRef.current?.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:24,right:24,width:40,height:40,borderRadius:"50%",background:"var(--accent)",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",zIndex:50,transition:"opacity 0.2s"}}>
            <I.ArrowUp size={18}/>
          </button>}
        </main>
      </div>
    </div>
  );
}
