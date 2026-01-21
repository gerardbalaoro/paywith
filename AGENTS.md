# Agent Guidelines

## General Rules

- **Styling**: Strictly use `shadcn` CSS variables (--primary, --border, etc.). Avoid hardcoded TailwindCSS color classes.
- **Strict Typing**: Always use explicit TypeScript types. Never use `any`.

## Schema Definitions

- **Zod 4**: Use Zod 4 syntax and features. Refer to the [Zod documentation](https://zod.dev/llms.txt) for usage.
- **Schema Naming**: Exported Zod schemas must be **PascalCase** and must **not** end with "Model" or "Schema" (e.g., use `User` instead of `UserSchema`).

## Tooling

- **Documentation**: Use the `upstash/context7` (Context7) tool whenever available to retrieve the latest documentation and API references for packages.
- **Dependency Management**: Never manually edit `package.json` for dependency changes. Always use `bun install` or `bun remove`.
- **UI Components**: Add new components using the `shadcn` CLI tool or the `shadcn` MCP server if available.
- **File Operations**: ALWAYS use the available tools for file system operations (read, write, edit). Only fallback to terminal commands if a specific tool is not available or the task is exceptionally complex.
- **Linting & Typechecking**: DO NOT run arbitrary commands for linting or TypeScript typechecking. Use the scripts defined in `package.json` or the built-in problems tool.
- **Build & Dev Scripts**: DO NOT run `bun run dev`, `bun run build`, or similar long-running/heavy scripts. Instead, instruct the developer to run them when necessary.
