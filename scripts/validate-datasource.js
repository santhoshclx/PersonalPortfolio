#!/usr/bin/env node
/**
 * validate-datasource.js
 * Validates JSON syntax, schema rules, and integrity in datasource/
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATASOURCE_DIR = path.join(ROOT_DIR, 'datasource');

const REQUIRED_FILES = [
  'site-config.json',
  'profile.json',
  'social-links.json',
  'skills.json',
  'experience.json',
  'projects.json',
  'certifications.json',
  'education.json',
  'achievements.json',
  'navigation.json',
  'blogs.json'
];

let errors = [];
let warnings = [];

console.log(`[*] Validating portfolio datasource in: ${DATASOURCE_DIR}\n`);

const loadedData = {};

for (const filename of REQUIRED_FILES) {
  const filepath = path.join(DATASOURCE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    errors.push(`Missing required file: ${filename}`);
    continue;
  }
  try {
    const raw = fs.readFileSync(filepath, 'utf8');
    loadedData[filename] = JSON.parse(raw);
    console.log(`  [OK] Syntax check passed: ${filename}`);
  } catch (err) {
    errors.push(`${filename}: JSON parse error: ${err.message}`);
  }
}

if (errors.length > 0) {
  console.error('\n[!] Parse errors found:');
  errors.forEach(e => console.error(`  [ERR] ${e}`));
  process.exit(1);
}

// Check profile
const prof = loadedData['profile.json'];
if (!prof.name || !prof.currentRole || !prof.headline) {
  errors.push('profile.json: Missing name, currentRole, or headline');
}

// Check projects
const projData = loadedData['projects.json'];
if (!Array.isArray(projData.projects) || projData.projects.length === 0) {
  errors.push('projects.json: Missing or empty projects array');
} else {
  const ids = new Set();
  projData.projects.forEach((p, idx) => {
    if (!p.id || !p.title || !p.detailUrl) {
      errors.push(`projects.json[${idx}]: Missing id, title, or detailUrl`);
    }
    if (ids.has(p.id)) {
      errors.push(`projects.json: Duplicate project id: ${p.id}`);
    }
    ids.add(p.id);
  });
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length > 0) {
  console.error(`[!] Validation failed with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  [FAIL] ${e}`));
  console.error('='.repeat(50));
  process.exit(1);
}

console.log(`[+] All ${REQUIRED_FILES.length} datasource files passed validation!`);
console.log('='.repeat(50));
process.exit(0);
