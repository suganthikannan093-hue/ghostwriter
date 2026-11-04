# Requirements Document

## Introduction

This spec adds two small features to GhostWriter: (a) a pure function that combines a generated spec into a single downloadable markdown bundle with a table of contents, and (b) live input validation feedback showing a character counter and friendly messages when the idea text is too short or too long. Both features reuse existing limits and renderers — no new external dependencies.

## Requirements

### Requirement 1: Downloadable markdown bundle

**User Story:** As a Kiro user, I want to download a single markdown file that combines the entire spec, so that I can share or archive the resurrection in one document.

#### Acceptance Criteria

1. WHEN the user clicks "Download bundle (.md)" THEN the system SHALL download a single markdown file containing the requirements, design, tasks and steering sections.
2. The system SHALL generate the bundle via a pure function in `lib/bundle.ts` that accepts a `Spec` and returns a string, with no React imports.
3. The bundle SHALL contain exactly one level-1 heading (the project name) and a table of contents listing each section.

### Requirement 2: Live character counter

**User Story:** As a maker, I want to see a live character count while I type, so that I know whether my input is within the accepted limits.

#### Acceptance Criteria

1. WHEN the user types in the textarea THEN the system SHALL display the current character count and the maximum allowed.
2. The system SHALL reuse the minimum and maximum input limits defined in `lib/schema.ts`.

### Requirement 3: Input validation feedback

**User Story:** As a maker, I want friendly feedback when my input is too short or too long, so that I can fix it before resurrecting.

#### Acceptance Criteria

1. IF the trimmed text is shorter than the minimum THEN the system SHALL show a message stating how many more characters are needed.
2. IF the text exceeds the maximum THEN the system SHALL show a message that the input is too long.
3. WHEN the input is within the valid range THEN the system SHALL not show any validation warning.
