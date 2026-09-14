#!/usr/bin/env node

/**
 * Content validation script for swedle.
 * Validates curated per-day content in src/data/days/week-*.json files.
 *
 * Usage: npm run validate
 */

import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const daysDir = join(__dirname, '..', 'src', 'data', 'days');

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`  ❌ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠️  ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}

// ========== Load all week files ==========
function loadAllDays() {
  const files = readdirSync(daysDir)
    .filter(f => f.match(/^week-\d+\.json$/))
    .sort();

  if (files.length === 0) {
    error('No week-*.json files found in src/data/days/');
    return [];
  }

  console.log(`\n📁 Found ${files.length} week file(s): ${files.join(', ')}`);

  const allDays = [];
  for (const file of files) {
    const path = join(daysDir, file);
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    if (!Array.isArray(data)) {
      error(`${file}: expected array, got ${typeof data}`);
      continue;
    }
    for (const day of data) {
      day._file = file;
    }
    allDays.push(...data);
  }

  return allDays.sort((a, b) => a.day - b.day);
}

// ========== Validate day numbering ==========
function validateSequence(days) {
  console.log('\n🔢 Day sequence');

  for (let i = 0; i < days.length; i++) {
    if (days[i].day !== i) {
      error(`Expected day ${i}, found day ${days[i].day} (in ${days[i]._file})`);
      return;
    }
  }

  ok(`Sequential days 0–${days.length - 1}, no gaps`);
}

// ========== Validate format field ==========
function validateFormats(days) {
  console.log('\n🎯 Formats');

  const validFormats = new Set(['mc', 'tf', 'connections', 'clues', 'estimate']);
  const formatCounts = { mc: 0, tf: 0, connections: 0, clues: 0, estimate: 0 };

  for (const day of days) {
    const prefix = `[Day ${day.day}]`;
    if (!day.format || !validFormats.has(day.format)) {
      error(`${prefix} invalid format "${day.format}"`);
    } else {
      formatCounts[day.format]++;
    }
  }

  ok(`Format distribution: MC=${formatCounts.mc}, T/F=${formatCounts.tf}, Connections=${formatCounts.connections}, Clues=${formatCounts.clues}, Estimate=${formatCounts.estimate}`);
}

// ========== Validate MC days ==========
function validateMC(day) {
  const prefix = `[Day ${day.day}]`;

  if (!Array.isArray(day.questions)) {
    error(`${prefix} missing questions array`);
    return;
  }
  if (day.questions.length !== 5) {
    error(`${prefix} expected 5 MC questions, got ${day.questions.length}`);
  }

  for (let i = 0; i < day.questions.length; i++) {
    const q = day.questions[i];
    const qPrefix = `${prefix} Q${i + 1}`;

    if (!q.question || typeof q.question !== 'string') error(`${qPrefix} missing question text`);
    if (!Array.isArray(q.options) || q.options.length !== 4) error(`${qPrefix} must have exactly 4 options`);
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) error(`${qPrefix} correctIndex must be 0-3`);
    if (!q.explanation || typeof q.explanation !== 'string') error(`${qPrefix} missing explanation`);
  }
}

// ========== Validate TF days ==========
function validateTF(day) {
  const prefix = `[Day ${day.day}]`;

  if (!Array.isArray(day.statements)) {
    error(`${prefix} missing statements array`);
    return;
  }
  if (day.statements.length !== 10) {
    error(`${prefix} expected 10 T/F statements, got ${day.statements.length}`);
  }

  for (let i = 0; i < day.statements.length; i++) {
    const s = day.statements[i];
    const sPrefix = `${prefix} S${i + 1}`;

    if (!s.statement || typeof s.statement !== 'string') error(`${sPrefix} missing statement text`);
    if (typeof s.answer !== 'boolean') error(`${sPrefix} answer must be boolean`);
    if (!s.explanation || typeof s.explanation !== 'string') error(`${sPrefix} missing explanation`);
  }
}

// ========== Validate Connections days ==========
function validateConnections(day) {
  const prefix = `[Day ${day.day}]`;

  if (!Array.isArray(day.groups)) {
    error(`${prefix} missing groups array`);
    return;
  }
  if (day.groups.length !== 4) {
    error(`${prefix} expected 4 groups, got ${day.groups.length}`);
  }

  const values = new Set();
  const difficulties = new Set();

  for (const g of day.groups) {
    // value may be numeric or a short string key (e.g. "O(log n)") — any unique
    // key for the trait the group's items share.
    if (g.value === undefined || g.value === null || g.value === '') error(`${prefix} group missing value`);
    if (!g.label || typeof g.label !== 'string') error(`${prefix} group missing label`);
    if (typeof g.difficulty !== 'number' || g.difficulty < 1 || g.difficulty > 4) {
      error(`${prefix} group difficulty must be 1-4, got ${g.difficulty}`);
    }
    if (!Array.isArray(g.expressions) || g.expressions.length !== 4) {
      error(`${prefix} each group must have exactly 4 expressions`);
    }

    if (values.has(g.value)) error(`${prefix} duplicate group value ${g.value}`);
    values.add(g.value);

    difficulties.add(g.difficulty);
  }

  if (difficulties.size !== 4) {
    error(`${prefix} must have difficulties 1,2,3,4 — found: ${[...difficulties].sort().join(',')}`);
  }
}

// ========== Validate Clues days ==========
function validateClues(day) {
  const prefix = `[Day ${day.day}]`;

  if (!day.term || typeof day.term !== 'string') error(`${prefix} missing term`);
  if (!Array.isArray(day.clues) || day.clues.length < 3 || day.clues.length > 6) {
    error(`${prefix} clues must be an array of 3-6 strings`);
  } else {
    for (const c of day.clues) {
      if (!c || typeof c !== 'string') error(`${prefix} each clue must be a non-empty string`);
    }
  }
  if (!Array.isArray(day.options) || day.options.length < 4 || day.options.length > 6) {
    error(`${prefix} options must be an array of 4-6 strings`);
  }
  if (typeof day.correctIndex !== 'number' || !day.options || day.correctIndex < 0 || day.correctIndex >= day.options.length) {
    error(`${prefix} correctIndex must be a valid index into options`);
  }
  if (day.options && day.term && day.options[day.correctIndex] !== day.term) {
    error(`${prefix} options[correctIndex] must equal term`);
  }
  if (!day.explanation || typeof day.explanation !== 'string') error(`${prefix} missing explanation`);
}

// ========== Validate Estimate days ==========
function validateEstimate(day) {
  const prefix = `[Day ${day.day}]`;

  if (!day.prompt || typeof day.prompt !== 'string') error(`${prefix} missing prompt`);
  if (typeof day.trueValue !== 'number' || day.trueValue <= 0) error(`${prefix} trueValue must be a positive number`);
  if (!day.unit || typeof day.unit !== 'string') error(`${prefix} missing unit`);
  if (!day.explanation || typeof day.explanation !== 'string') error(`${prefix} missing explanation`);
}

// ========== Run all ==========
console.log('🔍 Validating swedle content...');

const allDays = loadAllDays();

if (allDays.length > 0) {
  validateSequence(allDays);
  validateFormats(allDays);

  console.log('\n📝 Content shape validation');
  for (const day of allDays) {
    switch (day.format) {
      case 'mc': validateMC(day); break;
      case 'tf': validateTF(day); break;
      case 'connections': validateConnections(day); break;
      case 'clues': validateClues(day); break;
      case 'estimate': validateEstimate(day); break;
    }
  }
  ok(`All ${allDays.length} days validated`);

  if (allDays.length < 14) {
    warn(`Only ${allDays.length} days of curated content (< 14). Consider adding more.`);
  }
}

console.log('\n' + '─'.repeat(40));
if (errors > 0) {
  console.error(`\n💥 ${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n⚠️  ${warnings} warning(s), 0 errors — content is valid`);
} else {
  console.log('\n🎉 All content valid! No errors or warnings.');
}
