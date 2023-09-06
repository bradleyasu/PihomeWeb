#!/bin/bash

# Read the TypeScript file
file="src/Version.ts"
version=$(awk -F\" '/export const VERSION =/{print $2}' "$file")

# Increment the minor version number
major=$(cut -d. -f1 <<< "$version")
minor=$(cut -d. -f2 <<< "$version")
patch=$(cut -d. -f3 <<< "$version")

new_minor=$((minor + 1))

# Construct the updated version line
new_version="export const VERSION = \"$major.$new_minor.$patch\";"

# Create a temporary file for the modified content
temp_file=$(mktemp)

# Replace the version line in the temporary file
awk -v new_version="$new_version" '{ if (/export const VERSION/) { print new_version } else { print } }' "$file" > "$temp_file"

# Overwrite the original file with the updated content
mv "$temp_file" "$file"

echo "Version updated to $major.$new_minor.$patch"