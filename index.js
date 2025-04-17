// index.js

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

      return imports;
    } catch {
      return [];
    }
  }

  async function moveFile(src, destDir) {
    await fs.ensureDir(destDir);
    const dest = path.join(destDir, path.basename(src));
    if (path.resolve(src) !== path.resolve(dest)) {
      await fs.move(src, dest, { overwrite: true });
    }
  }

  async function handleFile(file) {
    console.log(`📂 Starting to handle file: ${file}`);

    if (path.extname(file) === ".json") {
      console.log(`⏩ Skipped JSON file: ${file}`);
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
          console.log(`✅ Matched and moving file: ${matchedFile}`);
          await moveFile(matchedFile, destDir);
          await handleFile(path.join(destDir, path.basename(matchedFile)));
        }
      } else if (importPath.startsWith(".")) {
        const sourceDir = path.dirname(file);
        const absoluteImportPath = path.resolve(sourceDir, importPath);
        let files = await glob(absoluteImportPath);
        if (!files.length) files = await glob(`${absoluteImportPath}.*`);

        if (!files.length) {
          console.log(`❌ No relative files found for import: ${importPath}`);
          continue;
        }

        for (const matchedFile of files) {
          console.log(`✅ Matched and moving relative file: ${matchedFile}`);
          await moveFile(matchedFile, sourceDir);
          await handleFile(path.join(sourceDir, path.basename(matchedFile)));
        }
      } else {
        console.log(`⏩ Skipped external module import: ${importPath}`);
      }
    }

    console.log(`🏁 Finished handling file: ${file}`);
  }

  const files = await glob(`${dir}/**/*.{ts,tsx,js,jsx,json}`, {
    ignore: "**/node_modules/**",
  });

  const normalizedFiles = files.map((file) => file.replace(/\\/g, "/"));
  for (const file of normalizedFiles) {
    await handleFile(file);
  }
}
