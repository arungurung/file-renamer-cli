#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// --- Configure Command Line Arguments ---
const argv = yargs(hideBin(process.argv))
  .usage(
    'Usage: node $0 -d <directory> [-p <prefix>] [-s <suffix>] [--dry-run]'
  )
  .option('d', {
    alias: 'directory',
    describe: 'Directory containing files to rename',
    type: 'string',
    demandOption: true, // Directory is required
  })
  .option('p', {
    alias: 'prefix',
    describe: 'Prefix to add to filenames',
    type: 'string',
    default: '', // Default to empty string if not provided
  })
  .option('s', {
    alias: 'suffix',
    describe: 'Suffix to add before the file extension',
    type: 'string',
    default: '', // Default to empty string if not provided
  })
  .option('dry-run', {
    describe: 'Show what would be renamed without actually renaming files',
    type: 'boolean',
    default: false,
  })
  .check((argv) => {
    if (!argv.prefix && !argv.suffix && !argv.dryRun) {
      throw new Error(
        'You must provide a prefix (-p) or a suffix (-s) to perform renaming.'
      );
    }
    return true;
  })
  .help()
  .alias('help', 'h').argv;

// --- Main Renaming Logic ---
async function batchRename(directory, prefix, suffix, dryRun) {
  console.log(`Scanning directory: ${directory}`);
  if (prefix) console.log(`Using prefix: "${prefix}"`);
  if (suffix) console.log(`Using suffix: "${suffix}"`);

  if (dryRun) {
    console.log('--- DRY RUN MODE --- (No files will be renamed)');
  }

  if (!prefix && !suffix) {
    console.log('No prefix or suffix provided. Exiting.');
    return;
  }

  try {
    const files = await fs.readdir(directory);
    let renameCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      const oldPath = path.join(directory, file);

      try {
        const stats = await fs.stat(oldPath);
        if (!stats.isFile()) {
          // console.log(`Skipping (not a file): ${file}`);
          continue; // Skip directories or other non-files
        }

        // Parse the filename to separate base name and extension
        const parsedPath = path.parse(file);
        const baseName = parsedPath.name; // Name without extension
        const extension = parsedPath.ext; // Extension with dot (e.g., '.txt')

        // Construct the new filename
        // Adds prefix (if any) -> base name -> suffix (if any) -> extension
        const newFilename = `${prefix}${baseName}${suffix}${extension}`;
        const newPath = path.join(directory, newFilename);

        // Only proceed if the name actually changes
        if (newFilename === file) {
          skippedCount++;
          continue;
        }

        if (dryRun) {
          console.log(`[Dry Run] Would rename: "${file}" -> "${newFilename}"`);
          renameCount++;
        } else {
          await fs.rename(oldPath, newPath);
          console.log(`Renamed: "${file}" -> "${newFilename}"`);
          renameCount++;
        }
      } catch (err) {
        console.error(`Error processing file ${file}: ${err.message}`);
      }
    }

    console.log(`\nFinished.`);
    console.log(
      `  ${renameCount} file(s) ${
        dryRun ? 'would be' : 'were'
      } processed for renaming.`
    );
    if (skippedCount > 0) {
      console.log(
        `  ${skippedCount} file(s) were skipped (name unchanged or not a file).`
      );
    }
  } catch (err) {
    console.error(`Error reading directory ${directory}: ${err.message}`);
    process.exit(1);
  }
}

// --- Run the Function ---
// Pass the parsed arguments directly
batchRename(argv.directory, argv.prefix, argv.suffix, argv.dryRun);
