# Fault-Tolerant Single-Agent Command Execution System

## Table of Contents

- [How To Run](#how-to-run)
- [Architecture Overview](#architecture-overview)
- [Persistence Approach](#persistence-approach)
- [Crash Recovery Explanation](#crash-recovery-explanation)
- [Trade-Offs & Decisions](#trade-offs--decisions)
- [How AI Was Used](#how-ai-was-used)
- [Where AI Was Wrong](#where-ai-was-wrong)
- [What Required Manual Debugging](#what-required-manual-debugging)

## How To Run

1. Clone the repository:
   `git clone https://github.com/TasneemZh/skipr-assessment-tasneem-zahdeh.git`

2. Make sure you have Docker Desktop (or a similar tool). Open it and ensure it is running.

3. Build the project images:
   `docker compose build`

4. Run the project using one of the following commands:
   - **For normal operation:**
     `docker compose up`

   - **To simulate an agent crash after N seconds:**
     `TASK_FLAG=--kill-after=N docker compose up`
     _(Replace `N` with the desired number of seconds)._

   - **To simulate random agent failures:**
     `TASK_FLAG=--random-failures docker compose up`

5. Use Postman (or any similar tool) to trigger the server via these APIs:
   - **Create a Fetch job:**

     ```bash
     curl --location 'http://localhost:3000/commands' \
     --header 'Content-Type: application/json' \
     --data '{
         "type": "HTTP_GET_JSON", "payload": {"url": "https://dog.ceo/api/breeds/image/random"}
     }'
     ```

   - **Create a Delay job:**

     ```bash
     curl --location 'http://localhost:3000/commands' \
     --header 'Content-Type: application/json' \
     --data '{
         "type": "DELAY", "payload": {"ms": 20000}
     }'
     ```

   - **Check Command Details:**
     _(Replace `{{commandId}}` with the actual ID returned from the creation step)_
     ```bash
     curl --location --globoff 'http://localhost:3000/commands/{{commandId}}'
     ```

## Architecture Overview

This backend system implements a robust server-agent pattern designed to handle interruptions gracefully. The architecture consists of a central Server that manages the job queue and one Agent that execute these jobs with multi-agent support.

The agent tracks running tasks via a standalone SQLite database. This local persistence is kept in sync with the server to ensure data integrity and idempotency. The agent supports two job types: **Fetch** (HTTP requests) and **Delay** (simulated wait times).

**The Workflow:**

1. **Polling:** The agent polls the server for jobs every 2 seconds if it is currently idle.
2. **Execution & Heartbeat:** Once a job is assigned, the agent executes it. While the job is running, the agent sends a "heartbeat" to the server every 10 seconds. This confirms the agent is alive and still processing the specific task.
3. **Completion:** Upon success or failure, the agent updates its local state to `COMPLETED_PENDING_ACK` and reports the result to the server. Only after the server acknowledges the report does the agent clear the job from its local database.
4. **Fault Simulation Flags:** To verify recovery logic, the agent supports two specific crash modes controlled by flags. These are designed to test the system without causing infinite loops:
   - **Deterministic Crash (`--kill-after=N`):** The agent schedules a self-termination after N seconds. To prevent an infinite loop where Docker restarts the agent and it crashes again immediately, the agent utilizes a **lock-file mechanism**.
     1. _First Run:_ The agent sees the flag, creates a lock file, and crashes as scheduled.
     2. _Restart:_ The agent detects the lock file, aborts the scheduled crash (allowing it to stabilize and recover), and immediately **deletes the lock file**. This ensures the crash happens exactly once per test cycle.
   - **Random Failure (`--random-failures`):** The agent has a 50% probability of crashing during execution. This mode does not use the lock file, making the behavior purely stochastic.

## Persistence Approach

SQLite was chosen as the persistence layer for both the server and the agent. It is lightweight, file-based, and fits the scope of a distributed system without requiring heavy external dependencies for this specific scale.

- **Data Persistence:** The database files are mapped to Docker volumes (`agent_data_1` and `server_data`). This ensures that even if containers are destroyed, rebuilt, or crash, the state is preserved.
- **Resilience:** The database is automatically created if it does not exist on the first run. To fully reset the system, these folders must be manually deleted from the repository.

## Crash Recovery Explanation

The system is designed to recover automatically from both agent and server failures without human intervention.

**1. Agent Recovery (Restart Logic)**

When an agent restarts (whether quickly or after a delay), it prioritizes finishing existing work before polling for new jobs. It iterates through its local database tasks sequentially:

- **Completed Jobs:** If a job was finished (`COMPLETED_PENDING_ACK`) but the server wasn't notified, the agent retries reporting the result.
- **Interrupted Jobs:** If a job was crashed mid-execution (`ASSIGNED`), the agent queries the server. If confirmed as the owner, it resumes; if revoked, it clears the job.
- **Failures & Loop Logic:** If a specific task fails to sync (e.g., server unreachable), the agent marks it locally (`isFailed=1`) and **immediately moves to the next local task** to prevent blocking.
- **Retry Mechanism:** The agent effectively retries these "failed/skipped" tasks in two ways:
  1.  **Via Polling:** If the server timed out the original job to `PENDING`, the agent eventually polls it. Upon detecting that the polled Command ID matches a local record, it ignores the server payload and resumes the local state (whether `ASSIGNED` or `COMPLETED_PENDING_ACK`).
  2.  **Via Restart:** On any fresh restart, the agent re-scans the entire local DB, giving previously failed tasks another chance to sync.

**2. Server Recovery & Timeout Logic**

- **Heartbeat Timeout:** The server utilizes a **30-second timeout** buffer. If an agent fails to ping (heartbeat) for 30 seconds, the server assumes the agent has died. It automatically transitions the command from `RUNNING` back to `PENDING`. This allows other active agents (or the same agent upon restart) to pick up the job, ensuring no task remains stuck indefinitely.
- **Server Startup Cleanup (Hard Reset):** On startup, the server specifically scans for any commands left in the `RUNNING` state. It deterministically resets these to `PENDING`. This is a safeguard to ensure a clean restart and avoid "zombie" states that would otherwise require a full timeout cycle to clear.

## Trade-Offs & Decisions

- **Heartbeat Ratio (10s vs 30s):** I implemented a 1:3 ratio for heartbeats. The agent pings every 10 seconds, but the server waits 30 seconds before timing out. This provides a safety buffer; if a single network request fails, the agent has two more chances to reach the server before the job is killed.
- **Server Restart Strategy:** Although the server **Hard Reset** never boots into an inconsistent state, it creates a potential race condition in multi-agent scenarios. If an agent completes a task just as the server restarts and resets it, another agent might pick it up. The original agent will fail its ownership check and discard its work. I accepted this risk of wasted CPU cycles in exchange for strict system consistency.
- **Docker Strategy:** I used `npm ci` instead of `npm install` in the Dockerfile for faster, cleaner, and more deterministic builds.
- **Failure Simulation (Lock File Lifecycle):** To prevent infinite crash loops when using `--kill-after` (where Docker restarts the container with the same kill flag), the AI suggested using a lock file to track if the crash had already occurred.
  _The Conflict:_ This created a persistent state where subsequent manual runs with this flag wouldn't crash at all because the lock file remained. The AI suggested using `TASK_FLAG=--kill-after=N docker compose --force-recreate` to wipe the container every time we need the crash to happen to solve this.
  _My Decision:_ I rejected the force-recreate approach as inefficient. Instead, I implemented a self-cleaning logic: on restart, if the agent detects the lock file, it deletes it. This ensures the crash happens exactly once per run without affecting future tests.

## How AI Was Used

AI served as a "Developer" and a brainstorming partner during this project:

- **Planning:** I verified my architectural understanding with AI after reading the requirements serveral times, ensuring my logic for the system/code implementation was sound.
- **Boilerplate:** AI generated the initial code structures and standard API setups, which saved significant typing time.
- **Refinement:** I used AI to request specific logic pieces one at a time, handling the "big picture" architecture myself while delegating isolated function implementations to the AI.

## Where AI Was Wrong

The AI struggled significantly with context, edge cases, and up-to-date tooling:

- **Outdated Tech Stack:** The AI defaulted to legacy CommonJS syntax and older Node versions. I had to manually research the latest Active LTS (Node 24), ECMAScript (ESM) compatibility, and Docker standards to force the implementation to use modern, long-term supported technologies.
- **Logic Flaws:** It suggested using `--force-recreate` to simulate crashes, which was an inefficient approach that didn't test the actual lock-file recovery logic I intended.
- **Code Structure:** The AI tended to dump all code into single files. I had to manually separate concerns into services, utils, and constants.
- **Edge Cases:** It frequently missed error handling scenarios, such as missing input validation in requests or timezone mismatches between JS local time and SQL UTC time.
- **Context Loss:** As the chat extended, the AI forgot previously established constraints (like the specific handling of `COMPLETED_PENDING_ACK` statuses), requiring me to open new chats to isolate specific implementation details.

## What Required Manual Debugging

Because the AI cannot run, test, or debug the code, the following relied entirely on manual engineering:

- **Docker Timing Inaccuracy:** I observed that `setTimeout` within the containerized environment consistently resolved 2-3ms earlier than the target duration. I implemented a corrective busy-wait loop to strictly enforce that the execution time never falls short of the user's requested delay.
- **Timezone Synchronization:** Correcting data discrepancies between the Node.js runtime and the SQLite database required manual intervention.
- **Crash Simulation:** The logic for `TASK_FLAG` and handling the specific kill signals was manually debugged to ensure it actually stopped the process at the exact right moment for testing purposes.
- **ESLint Unresponsiveness:** I had to manually investigate why ESLint was unresponsive despite a correct setup. The issue was traced to an outdated Prettier package which required replacement to restore functionality.
