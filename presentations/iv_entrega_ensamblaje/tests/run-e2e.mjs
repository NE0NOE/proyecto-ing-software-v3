#!/usr/bin/env node
import fs from 'node:fs';
import { startStaticServer, verifyPreflightAssets } from './lib/server.mjs';
import { launchHeadlessChrome, loadPlaywright } from './lib/harness.mjs';
import { getTier1Tests } from './tier1.mjs';
import { getTier2Tests } from './tier2.mjs';
import { getTier3Tests } from './tier3.mjs';
import { getTier4Tests } from './tier4.mjs';

function printHelp() {
  console.log(`
El Ensamblaje — Opaque-Box E2E Test Runner (Tiers 1–4, 193 Cases)

Usage:
  node tests/run-e2e.mjs [options]

Options:
  --tier=<list>      Comma-separated tiers to run (default: 1,2,3,4)
  --filter=<substr>  Run only tests whose ID or title contains <substr> (case-insensitive)
  --json=<path>      Optional path to write JSON summary report
  --help, -h         Show this help message and exit 0

Examples:
  node tests/run-e2e.mjs
  node tests/run-e2e.mjs --tier=1,2
  node tests/run-e2e.mjs --filter=T1-15
  node tests/run-e2e.mjs --tier=4 --json=/tmp/e2e.json
`.trim());
}

function parseArgs(argv) {
  const opts = {
    tiers: new Set([1, 2, 3, 4]),
    filter: null,
    jsonPath: null,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg.startsWith('--tier=')) {
      const raw = arg.slice('--tier='.length);
      opts.tiers = new Set(
        raw
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => [1, 2, 3, 4].includes(n))
      );
      if (opts.tiers.size === 0) {
        throw new Error(`Invalid --tier specification: "${raw}". Expected subset of 1,2,3,4.`);
      }
    } else if (arg.startsWith('--filter=')) {
      opts.filter = arg.slice('--filter='.length).trim().toLowerCase();
    } else if (arg.startsWith('--json=')) {
      opts.jsonPath = arg.slice('--json='.length).trim();
    } else {
      throw new Error(`Unknown CLI argument: "${arg}". Use --help for usage.`);
    }
  }

  return opts;
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    process.exit(2);
  }

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  // Preflight check before launching server or browser
  try {
    verifyPreflightAssets();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const allTests = [
    ...getTier1Tests(),
    ...getTier2Tests(),
    ...getTier3Tests(),
    ...getTier4Tests()
  ];

  const selected = allTests.filter((t) => {
    if (!opts.tiers.has(t.tier)) return false;
    if (opts.filter) {
      const hay = `${t.id} ${t.feature} ${t.title}`.toLowerCase();
      return hay.includes(opts.filter);
    }
    return true;
  });

  if (selected.length === 0) {
    console.error('[ERROR] No test cases matched the provided --tier / --filter criteria.');
    process.exit(1);
  }

  console.log(`\n🚀 Starting El Ensamblaje E2E Suite (${selected.length} test cases selected)...`);

  const serverHandle = await startStaticServer();
  const playwright = await loadPlaywright();
  const browser = await launchHeadlessChrome(playwright);

  const results = [];
  const tierStats = {
    1: { passed: 0, failed: 0 },
    2: { passed: 0, failed: 0 },
    3: { passed: 0, failed: 0 },
    4: { passed: 0, failed: 0 }
  };

  const suiteStart = Date.now();

  try {
    for (let idx = 0; idx < selected.length; idx += 1) {
      const tc = selected[idx];
      const t0 = Date.now();
      let status = 'PASS';
      let errorMsg = null;

      try {
        await tc.run({ browser, baseOrigin: serverHandle.baseOrigin });
        tierStats[tc.tier].passed += 1;
      } catch (err) {
        status = 'FAIL';
        errorMsg = err?.stack || err?.message || String(err);
        tierStats[tc.tier].failed += 1;
      }

      const durationMs = Date.now() - t0;
      results.push({
        id: tc.id,
        tier: tc.tier,
        feature: tc.feature,
        title: tc.title,
        status,
        durationMs,
        error: errorMsg
      });

      const prefix = status === 'PASS' ? '✅' : '❌';
      console.log(`${prefix} [${idx + 1}/${selected.length}] ${tc.id} (${tc.feature}) — ${tc.title} (${durationMs}ms)`);
      if (errorMsg) {
        console.error(`   ↳ ${errorMsg.split('\n')[0]}`);
      }
    }
  } finally {
    await browser.close();
    await serverHandle.close();
  }

  const totalDurationMs = Date.now() - suiteStart;
  const totalPassed = results.filter((r) => r.status === 'PASS').length;
  const totalFailed = results.filter((r) => r.status === 'FAIL').length;

  console.log('\n==================== E2E SUMMARY ====================');
  for (const tier of [1, 2, 3, 4]) {
    if (opts.tiers.has(tier)) {
      const s = tierStats[tier];
      console.log(`  Tier ${tier}: ${s.passed} passed, ${s.failed} failed`);
    }
  }
  console.log(`  TOTAL : ${totalPassed}/${selected.length} passed, ${totalFailed} failed (${(totalDurationMs / 1000).toFixed(2)}s)`);
  console.log('=====================================================\n');

  if (opts.jsonPath) {
    fs.writeFileSync(
      opts.jsonPath,
      JSON.stringify(
        {
          total: selected.length,
          passed: totalPassed,
          failed: totalFailed,
          durationMs: totalDurationMs,
          tierStats,
          results
        },
        null,
        2
      )
    );
  }

  process.exit(totalFailed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
