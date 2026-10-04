/** Deterministic helpers shared by the browser (live preview) and the server
 * (name generation), so a given seed always yields the same face and name. */

export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded PRNG (mulberry32). */
export function makeRng(seed: string): () => number {
  let a = hashSeed(seed) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const SEED_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

const ADJECTIVES = [
  "Sneaky", "Cosmic", "Wobbly", "Fuzzy", "Turbo", "Sleepy", "Spicy", "Mellow",
  "Jolly", "Sparkly", "Grumpy", "Zesty", "Quirky", "Bouncy", "Chill", "Dizzy",
  "Cheeky", "Plucky", "Breezy", "Snazzy", "Loopy", "Mighty", "Tiny", "Vivid",
];

const NOUNS = [
  "Otter", "Waffle", "Pickle", "Comet", "Walrus", "Noodle", "Badger", "Pixel",
  "Falcon", "Muffin", "Gecko", "Bubble", "Panda", "Biscuit", "Lantern", "Yeti",
  "Toucan", "Pretzel", "Koala", "Nugget", "Llama", "Cricket", "Mango", "Ninja",
];

/** "Cosmic Pickle" style anonymous handle, derived from the avatar seed. */
export function anonymousName(seed: string): string {
  const rng = makeRng(`name:${seed}`);
  const adjective = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(rng() * NOUNS.length)];
  return `${adjective} ${noun}`;
}
