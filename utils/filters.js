module.exports=function applyFilters(all, filters) {
    return all.filter((item) => {
      const p = item.properties;
      if (filters.is_palindrome !== undefined && p.is_palindrome !== filters.is_palindrome)
        return false;
      if (filters.word_count && p.word_count !== filters.word_count)
        return false;
      if (filters.min_length && p.length < filters.min_length)
        return false;
      if (filters.max_length && p.length > filters.max_length)
        return false;
      if (filters.contains_character &&
          !item.value.toLowerCase().includes(filters.contains_character.toLowerCase()))
        return false;
      return true;
    });
  }
  