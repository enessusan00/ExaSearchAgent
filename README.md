# 🔍 Exa Search Agent for OpenServ

> **Powerful web search capabilities using Exa's advanced search API**

[![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenServ](https://img.shields.io/badge/OpenServ-Agent-blue?style=flat-square)](https://openserv.ai)
[![Exa](https://img.shields.io/badge/Exa-API-orange?style=flat-square)](https://exa.ai)

This OpenServ agent leverages Exa's powerful search API to enable advanced web searching capabilities for your projects.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🧠 Neural Search** | Perform semantic searches that understand the meaning behind queries, not just keywords |
| **📄 Content Retrieval** | Get clean, parsed content from webpages without dealing with HTML scraping |
| **🔗 Similar Page Discovery** | Find webpages that are semantically similar to a given URL |
| **🔑 Individual API Key Management** | Each user can provide their own Exa API key |

## 🚀 Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` 
   - `OPENSERV_API_KEY`: Your OpenServ API key (required)
   - `EXA_API_KEY`: Optional default Exa API key (users can provide their own)
4. Build the agent: `npm run build`
5. Start the agent: `npm start`

## 📝 Registering on OpenServ

1. Create a developer account on [OpenServ](https://openserv.ai)
2. Navigate to Developer -> Add Agent
3. Fill in the details:
   - Agent Name: Exa Search Agent
   - Capabilities Description: "Powerful web search agent using Exa's neural search technology. Can perform semantic searches, retrieve webpage content, and find similar pages. Perfect for research, content discovery, and data gathering tasks. Supports individual API key management."
   - Endpoint URL: Your deployed agent URL
4. Create a secret key for your agent
5. Use this secret key as the `OPENSERV_API_KEY` in your .env file

## ⚙️ Capabilities

This agent provides six main capabilities:

### 1. API Key Management

- **setExaApiKey**: Set your personal Exa API key for this workspace
  - `apiKey`: Your Exa API key from dashboard.exa.ai

### 2. API Key Status Check

- **checkExaApiKey**: Check if an Exa API key is configured for this workspace
  - No parameters required

### 3. Search

Performs web searches using Exa's neural or keyword search:

- **Parameters**:
  - `query`: The search text
  - `type`: The search type (auto, neural, or keyword)
  - `numResults`: How many results to return (1-25)
  - `includeText`: Whether to include the full content of results

### 4. Get Contents

Retrieves clean, parsed content from specific URLs:

- **Parameters**:
  - `urls`: Array of URLs to get content from
  - `includeText`: Whether to include full text
  - `includeSummary`: Whether to include AI-generated summaries
  - `includeHighlights`: Whether to include relevant highlights

### 5. Find Similar

Finds webpages similar to a given URL:

- **Parameters**:
  - `url`: The URL to find similar pages for
  - `numResults`: How many results to return (1-25)
  - `includeText`: Whether to include the full content of results

### 6. Advanced Search

Performs comprehensive web searches with multiple filtering options:

- **Parameters**:
  - `query`: The search text
  - `type`: The search type (auto, neural, or keyword)
  - `numResults`: How many results to return (1-25)
  - `includeText`: Whether to include the full content of results
  - `startDate`: Filter results published after this date (YYYY-MM-DD)
  - `endDate`: Filter results published before this date (YYYY-MM-DD)
  - `includeDomains`: Only include results from these domains
  - `excludeDomains`: Exclude results from these domains
  - `category`: Filter by category (e.g., "research paper", "news", "company")

## 📋 Using the Agent

### First-time Setup

1. Create an Exa account at [dashboard.exa.ai](https://dashboard.exa.ai) (it's free)
2. Generate an API key at [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys)
3. In your OpenServ workspace, set your API key:

```
Please set my Exa API key to [YOUR_API_KEY_HERE]
```

4. Verify your API key is set:

```
Can you check if my Exa API key is properly configured?
```

### Basic Searches

Once your API key is set, you can start searching:

```
Search for the latest developments in quantum computing
```

Fetch page contents:

```
Get the contents of https://example.com/article
```

Find similar pages:

```
Find pages similar to https://example.com/article
```

### Advanced Searches

```
Perform an advanced search for climate change research published in the last year on .edu domains
```

## Development

- For development with hot reload: `npm run dev`
