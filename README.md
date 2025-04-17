# Organize Imports

**Organize Imports** is a convenient, robust utility to automatically organize your project files into appropriate directories based on their import statements. It helps maintain a clean and structured project, saving you from the manual hassle of moving files around.

## ⚡️ Common Use Case

**Ideal for fixing directory issues** created by automatic import-generation tools like `v0`, which typically place all components and related files into a flat directory structure. This tool easily and quickly reorganizes files into their intended structured directories, reducing manual work significantly.

## 🔑 Key Features

- **Automatic File Organization:** Moves files into directories automatically based on their imports.
- **Supports Multiple Source Directories:** Seamlessly works with directories like `components`, `lib`, `hooks`, `utils`, and `types`.
- **Flexible Import Alias Handling:** Easily customizable import alias (e.g., `@/components`).
- **CLI and Programmatic Usage:** Use it as a command-line tool or as an importable library in your scripts.

## 📦 Installation

Install with npm:

```bash
npm install organize-imports
```

## 🚀 Usage

### CLI Usage

Organize files directly from your command line:

```bash
npx organize-imports ./app
```

If installed globally:

```bash
organize-imports ./app
```

### Programmatic Usage

Use it directly in your JavaScript or TypeScript project:

```javascript
import { organizeProject } from "organize-imports";

organizeProject({ dir: "./app" })
  .then(() => {
    console.log("✅ Files have been organized successfully!");
  })
  .catch((error) => {
    console.error(`❌ An error occurred: ${error.message}`);
  });
```

## ⚙️ Configuration

Customize behavior by providing an options object:

```javascript
organizeProject({
  dir: "./app",
  sourceFolders: ["components", "lib", "hooks", "utils", "types"],
  importAlias: "@/components",
});
```

- `dir`: Directory to organize (default: `"./app"`).
- `sourceFolders`: Recognized source directories (default: `["components", "lib", "hooks", "utils", "types"]`).
- `importAlias`: Customizable import alias (default: `"@/"`).

## 📌 Additional Use Cases

- **React/Next.js Projects:** Maintain clean, well-structured component directories.
- **Large Codebases:** Quickly reorganize files based on import logic.
- **Maintainability:** Ensure consistent and easily navigable project structures.

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
