# LoveGame I — Agent Guidelines

## Project scope

- This is an Android-first mobile MVP built with React Native, Expo, and TypeScript.
- Implement only approved MVP scope. Do not add features outside it without explicit approval.
- Do not independently add AI recommendations, restaurant search, calendar sync, maps, or related integrations.

## Architecture boundaries

- UI must not implement or calculate domain game rules.
- The domain layer must not depend on React Native, Expo, React UI, or screen code.
- Keep Mission Result, EXP, Combo, and Rank calculations centralized in the domain layer.
- All database access must pass through repository abstractions.
- External services, including authentication, notifications, calendars, and location, must be accessed through service adapters. Do not call them directly from screens.

## Code quality and testing

- Prefer pure functions to make game logic straightforward to test.
- Every new or changed game rule must include unit tests.
- After completing each task, run lint, typecheck, and tests when the corresponding project scripts are available.
- When requirements are unclear, do not guess. State the assumptions before implementation and request clarification when the choice materially affects the product or architecture.

## File conventions

- Keep source files (`.tsx`, `.ts`, `.js`) strictly within 150–200 lines. Split responsibilities before exceeding this range.
- Architecture and specification documents (`.md`) have no line limit.
- Never manually modify generated or tool-managed directories: `.expo`, `.vscode`, or `node_modules`.
