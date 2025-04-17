#!/usr/bin/env node

import { organizeProject } from "./index.js";

const [, , dir = "./app"] = process.argv;

organizeProject({ dir })
  .then(() => {
    console.log(`✅ Project files in "${dir}" organized successfully!`);
  })
  .catch((error) => {
    console.error(`❌ Error organizing files: ${error.message}`);
    process.exit(1);
  });
