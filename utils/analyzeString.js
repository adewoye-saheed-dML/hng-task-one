// utils/analyzeString.js
const crypto = require("crypto");

module.exports = function analyze(value) {
  const lower = value.toLowerCase();
  const reversed = lower.split("").reverse().join("");
  const is_palindrome = lower === reversed;
  const unique_characters = new Set(value).size;
  const word_count = value.trim() ? value.trim().split(/\s+/).length : 0;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");
  const character_frequency_map = {};
  for (const ch of value) {
    character_frequency_map[ch] = (character_frequency_map[ch] || 0) + 1;
  }

  return {
    length: value.length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};


