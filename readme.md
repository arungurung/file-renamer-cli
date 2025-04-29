# File Renamer CLI

## Description

File Renamer CLI is a command-line tool designed to batch rename files within a specified directory by adding a prefix and/or suffix. This tool makes it easy to manage and organize files by updating their names in bulk.

## Features

- Add a prefix to filenames
- Add a suffix before the file extension
- Dry run mode to preview changes without modifying files
- Skips non-file items like directories
- Command-line interface for easy usage

## Installation

To install the File Renamer CLI, use npm:

```bash
npm install -g file-renamer-cli
```

## Usage

To use the File Renamer CLI, run the following command:

```bash
rn -d <directory> [-p <prefix>] [-s <suffix>] [--dry-run]
```

### Options

- `-d, --directory`: **(Required)** The directory containing files to rename.
- `-p, --prefix`: Prefix to add to filenames.
- `-s, --suffix`: Suffix to add before the file extension.
- `--dry-run`: Show what would be renamed without actually renaming files.

### Examples

Rename files in a directory with a prefix:

```bash
rn -d /path/to/directory -p "new_"
```

Rename files in a directory with a suffix and preview changes:

```bash
rn -d /path/to/directory -s "_backup" --dry-run
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Arun Gurung
