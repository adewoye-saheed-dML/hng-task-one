module.exports= function parseNaturalLanguageQuery(text) {
    const query = text.toLowerCase();
    const filters = {};
  
    // Detect "palindromic"
    if (query.includes("palindrom")) filters.is_palindrome = true;
  
    // Detect "single word" or "one word"
    if (query.includes("single word") || query.includes("one word"))
      filters.word_count = 1;
  
    // Detect "longer than X characters"
    const longerMatch = query.match(/longer than (\d+)/);
    if (longerMatch) filters.min_length = parseInt(longerMatch[1]) + 1;
  
    // Detect "shorter than X characters"
    const shorterMatch = query.match(/shorter than (\d+)/);
    if (shorterMatch) filters.max_length = parseInt(shorterMatch[1]) - 1;
  
    // Detect "containing the letter X" or "contains the letter X"
    const containMatch = query.match(/contain(?:ing|s)? (?:the )?letter (\w)/);
    if (containMatch) filters.contains_character = containMatch[1];
  
    // Detect "first vowel" (optional heuristic)
    if (query.includes("first vowel"))
      filters.contains_character = "a";
  
    // If no rules matched → return null
    return Object.keys(filters).length ? filters : null;
  }
  
  