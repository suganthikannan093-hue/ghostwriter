# Requirements Document

## Introduction

GhostWriter resurrects abandoned ideas and dead technology. A user pastes old notes or an obsolete snippet; GhostWriter returns a Kiro-ready project: EARS requirements, a design, an implementation plan, steering docs, a hook, and a small runnable starter, downloadable as a zip.

## Requirements

### Requirement 1: Accept the remains

**User Story:** As a maker with a graveyard of side projects, I want to paste rough notes or legacy code, so that I can revive them without rewriting a spec from scratch.

#### Acceptance Criteria

1. WHEN the user submits text of 20–8000 characters THEN the system SHALL start a resurrection.
2. IF the text is shorter than 20 characters THEN the system SHALL disable the Resurrect button and the API SHALL return HTTP 400.
3. The system SHALL offer "Abandoned idea" and "Dead tech" modes and a starter stack choice.

### Requirement 2: Produce a Kiro spec

**User Story:** As a Kiro user, I want output in Kiro's spec format, so that I can open it in Kiro and run tasks immediately.

#### Acceptance Criteria

1. WHEN a resurrection succeeds THEN the system SHALL show requirements.md, design.md and tasks.md tabs.
2. The system SHALL write acceptance criteria in EARS form (WHEN/IF … THEN … SHALL).
3. The system SHALL number tasks as Markdown checkboxes that reference requirement ids.

### Requirement 3: Produce a runnable starter

**User Story:** As a developer, I want starter code with a test, so that the revived project runs on day one.

#### Acceptance Criteria

1. WHEN a resurrection succeeds THEN the system SHALL show a file tree and a code viewer.
2. The system SHALL sanitise file paths so no file escapes the project root and model output cannot write `.kiro/` files.
3. WHEN the user clicks Download THEN the system SHALL produce a zip containing the starter and a `.kiro/` folder (specs, steering, hooks).

### Requirement 4: Work without a key

**User Story:** As a judge, I want the app to work offline, so that I can test it without credentials.

#### Acceptance Criteria

1. IF no `OPENAI_API_KEY` is set THEN the system SHALL use a deterministic demo and label it "DEMO MODE" in the UI.
2. WHEN OpenAI returns 429 or 5xx THEN the system SHALL retry up to twice with backoff.
3. The system SHALL never log or return API keys.
