import fs from "fs-extra";
import { glob } from "glob";
import path from "path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const DEFAULT_IMPORT_ALIAS = "@/";

export async function organizeProject({
  dir = "./app",
  sourceFolders = ["components", "lib", "hooks", "utils", "types"],
  importAlias = DEFAULT_IMPORT_ALIAS,
}) {
  async function parseImports(filePath) {
    const content = await fs.readFile(filePath, "utf-8");
    try {
      const ast = parse(content, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });

      const imports = [];
      traverse.default(ast, {
        ImportDeclaration({ node }) {
          imports.push(node.source.value);
        },
      });

      console.log(`🔍 Parsed imports from: ${filePath}`);
      return imports;
    } catch (error) {
      console.error(`❌ Parsing error in file: ${filePath}`);
      console.error(error.message);
      return [];
    }
  }

  async function moveFile(src, destDir) {
    await fs.ensureDir(destDir);
    const dest = path.join(destDir, path.basename(src));
    if (path.resolve(src) !== path.resolve(dest)) {
      await fs.move(src, dest, { overwrite: true });
      console.log(`✅ Moved ${src} → ${dest}`);
    }
  }

  async function handleFile(file) {
    console.log(`📂 Handling file: ${file}`);

    if (path.extname(file) === ".json") {
      console.log(`⏩ Skipped parsing JSON file: ${file}`);
      return;
    }

    const imports = await parseImports(file);

    for (const importPath of imports) {
      console.log(`🧩 Processing import: ${importPath}`);
      if (importPath.startsWith(importAlias)) {
        const relativePath = importPath.replace(importAlias, "");
        const segments = relativePath.split("/");
        if (!sourceFolders.includes(segments[0])) {
          console.log(`⏩ Skipped non-source folder import: ${importPath}`);
          continue;
        }

        const fileName = segments.pop();
        const destDir = path.join(...segments);
        const nestedSrcPattern = path.join(...segments, `${fileName}.*`);
        let matchedFiles = await glob(nestedSrcPattern.replace(/\\/g, "/"));

        if (!matchedFiles.length) {
          console.log(
            `⚠️ No match found at nested path, checking root source folder for: ${fileName}`
          );
          const rootSrcPattern = path.join(segments[0], `${fileName}.*`);
          matchedFiles = await glob(rootSrcPattern.replace(/\\/g, "/"));
        }

        if (!matchedFiles.length) {
          console.log(`❌ No files matched for import: ${importPath}`);
          continue;
        }

        for (const matchedFile of matchedFiles) {
          console.log(`🔀 Found matched file: ${matchedFile}`);
          await moveFile(matchedFile, destDir);
          await handleFile(path.join(destDir, path.basename(matchedFile)));
        }
      } else if (importPath.startsWith(".")) {
        const sourceDir = path.dirname(file);
        const absoluteImportPath = path.resolve(sourceDir, importPath);
        const globPath = absoluteImportPath.replace(/\\/g, "/");

        let files = await glob(globPath);
        if (!files.length) {
          files = await glob(`${globPath}.*`);
        }

        const destDir = sourceDir;

        if (!files.length) {
          console.log(
            `❌ No relative file found at first attempt for import: ${importPath}`
          );

          for (const folder of sourceFolders) {
            const fallbackGlob = path
              .join(folder, path.basename(importPath) + ".*")
              .replace(/\\/g, "/");
            const fallbackFiles = await glob(fallbackGlob);
            if (fallbackFiles.length) {
              console.log(
                `🔀 Found fallback matched file: ${fallbackFiles[0]}`
              );
              await moveFile(fallbackFiles[0], destDir);
              await handleFile(
                path.join(destDir, path.basename(fallbackFiles[0]))
              );
              break;
            }
          }
          continue;
        }

        for (const matchedFile of files) {
          console.log(`🔀 Found relative matched file: ${matchedFile}`);
          await moveFile(matchedFile, destDir);
          await handleFile(path.join(destDir, path.basename(matchedFile)));
        }
      } else {
        console.log(`⏩ Skipped external module import: ${importPath}`);
      }
    }
  }

  const files = await glob(`${dir}/**/*.{ts,tsx,js,jsx,json}`, {
    ignore: "**/node_modules/**",
  });

  const normalizedFiles = files.map((file) => file.replace(/\\/g, "/"));
  console.log({ normalizedFiles });

  console.log(`🚀 Organizing project files from directory: ${dir}`);
  for (const file of normalizedFiles) {
    await handleFile(file);
  }
  console.log("🎉 File organization complete!");
}

// Direct execution for local testing
if (import.meta.url === `file://${process.argv[1]}`) {
  organizeProject({ dir: "./app" }).catch(console.error);
}
