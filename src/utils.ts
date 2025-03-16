/**
 * Utility functions for the Exa Search Agent
 */

/**
 * Formats search results for better readability
 * @param results The search results to format
 * @param includeFullText Whether to include full text in the output
 */
export function formatSearchResults(results: any[], includeFullText = false): string {
  if (!results || results.length === 0) {
    return "No results found.";
  }

  return results.map((result, index) => {
    const formattedResult = [
      `[${index + 1}] ${result.title || 'No title'}`,
      `URL: ${result.url}`,
      result.publishedDate ? `Published: ${result.publishedDate}` : '',
      result.author ? `Author: ${result.author}` : '',
    ];

    // Add highlights if available
    if (result.highlights && result.highlights.length > 0) {
      formattedResult.push('\nHighlights:');
      result.highlights.forEach((highlight: string, i: number) => {
        formattedResult.push(`  - ${highlight.trim()}`);
      });
    }

    // Add summary if available
    if (result.summary) {
      formattedResult.push('\nSummary:');
      formattedResult.push(`  ${result.summary}`);
    }

    // Add text if requested and available
    if (includeFullText && result.text) {
      formattedResult.push('\nFull Text (Preview):');
      formattedResult.push(`  ${result.text.substring(0, 500)}... [text truncated]`);
    }

    return formattedResult.filter(line => line !== '').join('\n');
  }).join('\n\n---------------------------------\n\n');
}

/**
 * Creates an advanced search query based on user input
 * @param baseQuery The base search query
 * @param options Additional search options
 */
export function createAdvancedQuery(baseQuery: string, options: {
  startDate?: string,
  endDate?: string,
  includeDomains?: string[],
  excludeDomains?: string[]
}): any {
  const searchParams: any = {
    query: baseQuery
  };

  if (options.startDate) {
    searchParams.startPublishedDate = options.startDate;
  }

  if (options.endDate) {
    searchParams.endPublishedDate = options.endDate;
  }

  if (options.includeDomains && options.includeDomains.length > 0) {
    searchParams.includeDomains = options.includeDomains;
  }

  if (options.excludeDomains && options.excludeDomains.length > 0) {
    searchParams.excludeDomains = options.excludeDomains;
  }

  return searchParams;
}
