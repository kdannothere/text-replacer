# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Other commands

npx @bedframe/cli make

## The Workflow:

**The Developer Step**: npx changeset
When you finish a feature (e.g., adding a new Radix popup), you run the command. It asks you:

- Which packages changed? (Your extension, your UI library, etc.)

- Is this a Major, Minor, or Patch?

- What did you do? (e.g., "Added Nova-themed Radix Dialog").

This creates a small Markdown file in a .changeset folder. You commit this file with your code.

**The Release Step**: npx changeset version
When you are ready to publish to the Chrome Web Store, you run the version command.

- It consumes all those "sticky notes" (Markdown files).

- It calculates the new version number (e.g., if you had three patches and one minor, it bumps to the next Minor).

- It updates your package.json and your browser manifest.json automatically.

- It deletes the Markdown files and generates a CHANGELOG.md.
