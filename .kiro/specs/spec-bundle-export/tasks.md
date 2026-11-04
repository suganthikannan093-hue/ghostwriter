# Implementation Plan

- [x] 1. Add MIN_INPUT export to lib/schema.ts and use it in InputSchema
  - _Requirements: 2.2, 3.1_
- [x] 2. Create lib/bundle.ts with bundleMd pure function
  - _Requirements: 1.1, 1.2, 1.3_
- [x] 3. Add live character counter to GhostWriter.tsx
  - _Requirements: 2.1, 2.2_
- [x] 4. Add validation messages (too short / too long) to GhostWriter.tsx
  - _Requirements: 3.1, 3.2, 3.3_
- [x] 5. Add Download bundle (.md) button to GhostWriter.tsx
  - _Requirements: 1.1_
- [x] 6. Add CSS for counter and validation messages to globals.css
  - _Requirements: 2.1, 3.1_
- [x] 7. Write tests/bundle.test.ts
  - _Requirements: 1.2, 1.3_
- [x] 8. Add .kiro/hooks/spec-sync.json agent hook
- [x] 9. Run npm test, npm run typecheck, npm run lint and fix failures
- [x] 10. Mark tasks done in tasks.md
