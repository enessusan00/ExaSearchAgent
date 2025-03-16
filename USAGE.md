# Using the Exa Search Agent

This document provides examples of how to use the Exa Search Agent effectively through the OpenServ platform.

## Getting Started with API Keys

Before using the search capabilities of this agent, you need to configure your own Exa API key.

### Setting up your API Key

1. Create a free Exa account at [dashboard.exa.ai](https://dashboard.exa.ai)
2. Navigate to [API Keys](https://dashboard.exa.ai/api-keys) and create a new key
3. Set your API key in the agent:

```
setExaApiKey [YOUR_API_KEY]
```

Or use natural language:

```
Please set my Exa API key to [YOUR_API_KEY]
```

### Verifying your API Key

To check if your API key is properly configured:

```
checkExaApiKey
```

Or in natural language:

```
Is my Exa API key properly configured?
```

### API Key Security

- Your API key is stored only in your workspace and is not shared with other users
- Each API key gets 1,000 free searches per month
- You can update your API key at any time by running the setExaApiKey command again

## Basic Search Examples

### Simple Search

Ask the agent to search for information about a topic:

```
Can you search for information about quantum computing?
```

The agent will perform an "auto" search that automatically chooses between neural and keyword search based on the query.

### Neural Search

For complex semantic queries:

```
Find me resources explaining how machine learning is applied in healthcare for early disease detection
```

### Keyword Search

For specific term matching:

```
Search for papers mentioning "transformer architecture" published in the last year
```

## Advanced Usage

### Getting Full Content

To get the complete text of search results:

```
Search for the latest climate change reports and include the full text of each result
```

### Finding Similar Content

To find content similar to a specific URL:

```
Find pages similar to https://example.com/article and include summaries
```

### Targeted Research

For specific research tasks:

```
I'm researching the impact of social media on teenage mental health. Can you find 5 academic sources and include highlights from each?
```

## Tips for Effective Searching

1. **Be Specific**: The more details you provide, the better the agent can target your search.

2. **Consider Search Type**: 
   - Use neural search for conceptual or semantic searches
   - Use keyword search when you need exact term matching

3. **Limit Results**: If you only need a few high-quality results, specify the number to save processing time.

4. **Request Highlights**: Instead of full text, ask for highlights to get the most relevant excerpts.

5. **Try Different API Keys**: If you reach your usage limit (1,000 searches per month on the free tier), you can create a new Exa account and update your API key.

## Common Tasks

### Research Assistant

```
I'm writing a paper about renewable energy innovations. Can you find 5 recent sources and extract the key innovations mentioned in each?
```

### News Monitoring

```
Find the latest news about SpaceX launches from the past week
```

### Content Discovery

```
I enjoyed reading about behavioral economics at https://example.com/article. Can you find similar content?
```

### Fact Checking

```
Is it true that coffee consumption is linked to decreased risk of certain diseases? Find me scientific sources.
```

## Advanced Filtering

The agent supports various filtering options for more targeted searches:

### Date Filtering

```
Find research on quantum computing published in the last year
```

### Domain Filtering

```
Search for climate policy information from .gov and .edu domains only
```

### Content Category

```
Find company information about startups working on AI
```

## Troubleshooting

### API Key Issues

If you encounter errors like "Invalid API key" or "API key not found":

1. Verify your API key is correct using the checkExaApiKey command
2. Try setting your API key again with setExaApiKey
3. Generate a new API key from the Exa dashboard if necessary

### Search Result Quality

If you're not getting the results you expect:

1. Try rephrasing your query
2. Specify a different search type (neural vs keyword)
3. Use more specific filtering criteria
4. For neural search, try phrasing your query as a statement ending with a colon

### Usage Limits

If you reach your API usage limits:

1. Create a new Exa account for additional free searches
2. Consider upgrading to a paid Exa plan for higher limits
3. Be more selective with your searches and which results need full content retrieval