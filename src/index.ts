import { Agent } from '@openserv-labs/sdk';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import Exa from 'exa-js';
import { formatSearchResults, createAdvancedQuery } from './utils';

// Load environment variables
dotenv.config();

// Default API key from environment (optional, user can provide their own)
const DEFAULT_EXA_API_KEY = process.env.EXA_API_KEY || '';

// Create agent
const agent = new Agent({
  systemPrompt: `You are an advanced Exa search agent capable of performing web searches and retrieving content.
Exa is a powerful search engine that uses neural search to understand the meaning behind queries.
You can search for information, get contents of webpages, and find similar pages based on URLs.`,
  apiKey: process.env.OPENSERV_API_KEY
});

// Function to get the user's API key from workspace if available
async function getUserExaApiKey(workspaceId: number): Promise<string> {
  try {
    const files = await agent.getFiles({
      workspaceId
    });

    const configFile = files.find((f: any) => f.path === '.exa_config');
    
    if (configFile?.fullUrl) {
      const response = await fetch(configFile.fullUrl);
      
      if (response.ok) {
        const configData = await response.text();
        try {
          const config = JSON.parse(configData);
          if (config.apiKey) {
            return config.apiKey;
          }
        } catch (e) {
          console.error('Error parsing config file:', e);
        }
      }
    }
    
    return DEFAULT_EXA_API_KEY;
  } catch (error) {
    console.error('Error retrieving user API key:', error);
    return DEFAULT_EXA_API_KEY;
  }
}

// Get an Exa client with the appropriate API key
async function getExaClient(workspaceId: number): Promise<Exa> {
  const apiKey = await getUserExaApiKey(workspaceId);
  return new Exa(apiKey);
}

// API Key management capability
agent.addCapability({
  name: 'setExaApiKey',
  description: 'Set your personal Exa API key for search operations',
  schema: z.object({
    apiKey: z.string().describe('Your Exa API key from dashboard.exa.ai')
  }),
  async run({ args, action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided.";
    }

    try {
      // Save API key to workspace
      await agent.uploadFile({
        workspaceId: action.workspace.id,
        path: '.exa_config',
        file: JSON.stringify({ apiKey: args.apiKey }),
        skipSummarizer: true
      });
      
      return "Your Exa API key has been securely saved for this workspace. You can now use the search capabilities. Your API key is only stored in your workspace and not accessible to other users.";
    } catch (error) {
      return `Error saving API key: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Check API key capability
agent.addCapability({
  name: 'checkExaApiKey',
  description: 'Check if an Exa API key is configured for this workspace',
  schema: z.object({}),
  async run({ action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided.";
    }

    try {
      const apiKey = await getUserExaApiKey(action.workspace.id);
      
      if (apiKey === DEFAULT_EXA_API_KEY && DEFAULT_EXA_API_KEY === '') {
        return "No Exa API key is configured for this workspace. Please use the 'setExaApiKey' capability to set your API key if user gives you for example '12345678-1234-5678-1234-123456789012' you should write to the file EXA_API_KEY='12345678-1234-5678-1234-123456789012'). You can get a free API key from https://dashboard.exa.ai/api-keys.";
      } else if (apiKey === DEFAULT_EXA_API_KEY) {
        return "Using the default Exa API key. For personal usage, please set your own API key using the 'setExaApiKey' capability (if user gives you for example '12345678-1234-5678-1234-123456789012' you should write to the file EXA_API_KEY='12345678-1234-5678-1234-123456789012'). You can get a free API key from https://dashboard.exa.ai/api-keys.";
      } else {
        return "An Exa API key is configured for this workspace. You're ready to use the search capabilities.";
      }
    } catch (error) {
      return `Error checking API key: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Search capability
agent.addCapability({
  name: 'search',
  description: 'Perform a web search using Exa and return relevant results',
  schema: z.object({
    query: z.string().describe('The search query'),
    type: z.enum(['auto', 'neural', 'keyword']).optional().describe('The type of search to perform'),
    numResults: z.number().min(1).max(25).optional().describe('Number of results to return'),
    includeText: z.boolean().optional().describe('Whether to include full text of results')
  }),
  async run({ args, action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided. Please try again.";
    }

    const { query, type = 'auto', numResults = 5, includeText = false } = args;
    
    try {
      // Get Exa client with appropriate API key
      const exaClient = await getExaClient(action.workspace.id);
      
      const searchResponse = await exaClient.search(query, {
        type,
        numResults,
        useAutoprompt: true
      });
      
      // If text is requested, get contents for each result
      if (includeText) {
        const resultsWithContent = await exaClient.getContents(
          searchResponse.results.map(result => result.url),
          { text: true }
        );
        
        return formatSearchResults(resultsWithContent.results, true);
      }
      
      return formatSearchResults(searchResponse.results, false);
    } catch (error) {
      return `Error performing search: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Get contents capability
agent.addCapability({
  name: 'getContents',
  description: 'Get clean, parsed content from specific URLs',
  schema: z.object({
    urls: z.array(z.string()).describe('Array of URLs to get content from'),
    includeText: z.boolean().optional().describe('Whether to include full text'),
    includeSummary: z.boolean().optional().describe('Whether to include AI-generated summary'),
    includeHighlights: z.boolean().optional().describe('Whether to include relevant highlights')
  }),
  async run({ args, action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided. Please try again.";
    }

    const { urls, includeText = true, includeSummary = false, includeHighlights = false } = args;
    
    try {
      // Get Exa client with appropriate API key
      const exaClient = await getExaClient(action.workspace.id);
      
      const options: any = {};
      
      if (includeText) options.text = true;
      if (includeSummary) options.summary = true;
      if (includeHighlights) options.highlights = true;
      
      const contentsResponse = await exaClient.getContents(urls, options);
      return formatSearchResults(contentsResponse.results, includeText);
    } catch (error) {
      return `Error getting contents: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Find similar pages capability
agent.addCapability({
  name: 'findSimilar',
  description: 'Find pages similar to a given URL',
  schema: z.object({
    url: z.string().describe('The URL to find similar pages for'),
    numResults: z.number().min(1).max(25).optional().describe('Number of results to return'),
    includeText: z.boolean().optional().describe('Whether to include full text of results')
  }),
  async run({ args, action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided. Please try again.";
    }

    const { url, numResults = 5, includeText = false } = args;
    
    try {
      // Get Exa client with appropriate API key
      const exaClient = await getExaClient(action.workspace.id);
      
      const options: any = { numResults };
      if (includeText) options.text = true;
      
      const similarResponse = await exaClient.findSimilar(url, options);
      return formatSearchResults(similarResponse.results, includeText);
    } catch (error) {
      return `Error finding similar pages: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Advanced search capability
agent.addCapability({
  name: 'advancedSearch',
  description: 'Perform an advanced web search with filtering options',
  schema: z.object({
    query: z.string().describe('The search query'),
    type: z.enum(['auto', 'neural', 'keyword']).optional().describe('The type of search to perform'),
    numResults: z.number().min(1).max(25).optional().describe('Number of results to return'),
    includeText: z.boolean().optional().describe('Whether to include full text of results'),
    startDate: z.string().optional().describe('Filter results published after this date (YYYY-MM-DD)'),
    endDate: z.string().optional().describe('Filter results published before this date (YYYY-MM-DD)'),
    includeDomains: z.array(z.string()).optional().describe('Only include results from these domains'),
    excludeDomains: z.array(z.string()).optional().describe('Exclude results from these domains'),
    category: z.string().optional().describe('Filter by category (e.g., "research paper", "news", "company")')
  }),
  async run({ args, action }) {
    if (!action?.workspace?.id) {
      return "Error: No workspace context provided. Please try again.";
    }

    const { 
      query, 
      type = 'auto', 
      numResults = 5, 
      includeText = false,
      startDate,
      endDate,
      includeDomains,
      excludeDomains,
      category
    } = args;
    
    try {
      // Get Exa client with appropriate API key
      const exaClient = await getExaClient(action.workspace.id);
      
      const searchParams: any = {
        type,
        numResults,
        useAutoprompt: true
      };
      
      if (startDate) searchParams.startPublishedDate = startDate;
      if (endDate) searchParams.endPublishedDate = endDate;
      if (includeDomains) searchParams.includeDomains = includeDomains;
      if (excludeDomains) searchParams.excludeDomains = excludeDomains;
      if (category) searchParams.category = category;
      
      const searchResponse = await exaClient.search(query, searchParams);
      
      if (includeText) {
        const resultsWithContent = await exaClient.getContents(
          searchResponse.results.map(result => result.url),
          { text: true }
        );
        
        return formatSearchResults(resultsWithContent.results, true);
      }
      
      return formatSearchResults(searchResponse.results, false);
    } catch (error) {
      return `Error performing advanced search: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
});

// Start the agent
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 7378;
agent.start();

console.log(`Exa Search Agent is running on port ${PORT}`);
