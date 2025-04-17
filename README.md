# Organize Imports

**Organize Imports** is a convenient and robust CLI utility to automatically organize your project files into appropriate directories based on their import statements. It maintains a clean and structured project, significantly reducing manual file management.

## ⚡️ Common Use Case

**Perfect for fixing directory issues** caused by tools like `v0`, which often place components and related files into a flat directory structure. This utility effortlessly reorganizes files into their intended structured directories.

## 🔑 Key Features

- **Automatic File Organization:** Moves files into directories automatically based on their imports.
- **Supports Multiple Source Directories:** Works seamlessly with directories like `components`, `lib`, `hooks`, `utils`, and `types`.
- **Flexible Import Alias Handling:** Customizable import alias (e.g., `@/components`).
- **Command-line Only:** Simple CLI commands without the need for additional imports or setup.

## 📦 Installation

Install with npm:

```bash
npm install @sonulodha/organize-imports
```

## 🚀 Usage

### CLI Usage

Use it directly from your command line (recommended):

```bash
npx @sonulodha/organize-imports ./app
```

If installed globally:

```bash
npm install -g @sonulodha/organize-imports
organize-imports ./app
```

## ⚙️ Configuration (Optional)

The CLI organizes files based on these sensible defaults:

- `dir`: Directory to organize (default: `"./app"`).
- `sourceFolders`: Directories considered sources (`["components", "lib", "hooks", "utils", "types"]`).
- `importAlias`: Import alias (`"@/"`).

For custom usage, consider modifying source code directly or contribute enhancements.

## 📌 Additional Use Cases

- **React/Next.js Projects:** Keep component directories structured.
- **Large Codebases:** Automatically reorganize files logically.
- **Maintainability:** Maintain consistent, navigable structures.

## 🤝 Contributing

## 🤝 Contributing

We welcome contributions, bug reports, and feature requests!

- To **report an issue** or suggest a new feature, please [open an issue on GitHub](https://github.com/sonumagnus/organize-imports/issues).
- To **contribute directly**, submit a pull request on [GitHub](https://github.com/sonumagnus/organize-imports/pulls).

## 🐛 Reporting Issues

Encountered a problem? Please [open an issue](https://github.com/sonumagnus/organize-imports/issues).

## 🌟 Star the Project

If this tool helped you, please star the repository: [⭐ Star on GitHub](https://github.com/sonumagnus/organize-imports)

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
