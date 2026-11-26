// Monday Morning Punchlines — make.fun entry.
//
// The program writes one original joke about Monday mornings to
// /output/entry.txt. The joke is a fixed, hand-written line: the entry
// is the text itself, so the program is deterministic on purpose —
// the grader runs it twice and must see the same joke both times.
//
// The joke: the weekend was only ever a free trial, and Monday
// morning is when the subscription kicks in.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE = "The weekend was just a free trial. Monday is the subscription.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_LENGTH = 200;

function checkJoke(text: string): void {
  if (text.length === 0) {
    throw new Error("joke must not be empty");
  }
  if (text.length > MAX_LENGTH) {
    throw new Error(
      `joke is ${text.length} characters, over the ${MAX_LENGTH} limit`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be only white space");
  }
  // The competition judges only jokes about Monday mornings: refuse
  // any text that lost its Monday reference while being edited.
  if (!/monday/i.test(text)) {
    throw new Error("joke must be about Monday mornings");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
  // The gate counts characters, but the leaderboard's Size column counts
  // bytes: keep the text inside the limit on both counts so the entry
  // stays valid whichever way it is measured.
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength > MAX_LENGTH) {
    throw new Error(
      `joke is ${byteLength} bytes, over the ${MAX_LENGTH} limit`,
    );
  }
  // Reject any character that would not survive a UTF-8 round trip.
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    throw new Error("joke is not clean UTF-8 text");
  }
}

function main(): void {
  checkJoke(JOKE);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  // Write the line exactly, with no trailing newline, so the file holds
  // precisely the joke the judge reads — nothing more.
  writeFileSync(OUTPUT_PATH, JOKE, "utf8");
  // Read it back and confirm the file holds exactly the joke: a grader
  // that runs this program twice must see the same text both times.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== JOKE) {
    throw new Error("entry.txt does not match the joke after writing");
  }
  console.log(`wrote ${JOKE.length} characters to ${OUTPUT_PATH}`);
  console.log(JOKE);
}

main();
