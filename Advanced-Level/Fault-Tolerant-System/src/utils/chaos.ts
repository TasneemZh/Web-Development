import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

const CHAOS_RANDOM_FAILURES = args.includes('--random-failures');
const LOCK_FILE_PATH = path.resolve('chaos_crash_performed.lock');

export const initializeChaos = () => {
  const killAfterArg = args.find((arg) => arg.startsWith('--kill-after='));

  if (killAfterArg) {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      console.log('[Chaos] ❕ Crash recovery detected.');
      console.log('[Chaos] 🧹 Deleting lock file so the NEXT manual run crashes again.');

      try {
        fs.unlinkSync(LOCK_FILE_PATH);
      } catch (err) {
        console.error('[Chaos] Failed to cleanup lock file:', err);
      }

      return;
    }

    const seconds = parseInt(killAfterArg.split('=')[1], 10);

    if (!isNaN(seconds) && seconds > 0) {
      console.log(`[Chaos] 🚨 Agent scheduled to CRASH in ${seconds} seconds.`);

      setTimeout(() => {
        console.error('[Chaos] 💀 Time is up! Crashing agent now via --kill-after.');

        try {
          fs.writeFileSync(LOCK_FILE_PATH, new Date().toISOString());
        } catch (err) {
          console.error('[Chaos] Failed to write lock file:', err);
        }

        process.exit(1);
      }, seconds * 1000);
    }
  }

  if (CHAOS_RANDOM_FAILURES) {
    console.log('[Chaos] 🎲 Random failures enabled (50% chance per job).');
  }
};

export const attemptRandomCrash = (contextId?: string) => {
  if (!CHAOS_RANDOM_FAILURES) return;

  if (Math.random() < 0.5) {
    console.error(
      `[Chaos] 🎲 Random failure triggered! Crashing process during ${contextId || 'execution'}.`,
    );
    process.exit(1);
  }
};
