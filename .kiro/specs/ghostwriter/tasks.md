# Implementation Plan

- [x] 1. Define input/output schemas and strict JSON schema
  - _Requirements: 1.1, 1.2, 2.2_
- [x] 2. Implement prompt and OpenAI call with retry + demo fallback
  - _Requirements: 2.1, 4.1, 4.2, 4.3_
- [x] 3. Implement path sanitiser and Kiro markdown renderers
  - _Requirements: 2.2, 2.3, 3.2_
- [x] 4. Build API route `/api/resurrect` (GET mode, POST resurrect)
  - _Requirements: 1.1, 1.2, 4.1_
- [x] 5. Build UI: input panel, samples, tabs, file tree, zip download
  - _Requirements: 1.3, 2.1, 3.1, 3.3_
- [x] 6. Write tests incl. property-style path test
  - _Requirements: 3.2, 4.1_
- [ ] 7. Deploy public demo URL for judges
  - _Requirements: 4.1_
