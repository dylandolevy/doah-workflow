# DoAH AI Chatbot Demo

## Overview

This repository contains a demo web application showcasing an AI-powered assistant built for Duke University's DoAH.

The application integrates an OpenAI Agent Builder workflow into a Next.js frontend using ChatKit and is deployed on Vercel for demonstration purposes.

The goal of this project is to demonstrate how a structured AI workflow can be embedded into a web interface while minimizing hallucinations.

---

## Workflow Design

The underlying OpenAI Agent workflow is designed to:

- Prioritize **file-based search** as the primary information source  
- Only use **web search** when file search does not provide sufficient information  
- Provide responses grounded in available documentation  
- Reduce speculative or unsupported outputs  

This retrieval-first approach ensures answers remain accurate, verifiable, and grounded in approved materials.

The workflow logic is fully implemented in OpenAI Agent Builder, while this repository focuses on providing a frontend interface for interacting with that workflow.

---

## Tech Stack

- **Next.js (App Router)**
- **Tailwind CSS**
- **OpenAI Agent Builder**
- **OpenAI ChatKit**
- **Vercel (hosting + serverless functions)**

---

## Architecture

High-level request flow:

Browser  
→ `/api/chatkit/session` (Next.js server route)  
→ OpenAI ChatKit session creation  
→ OpenAI Agent workflow  
→ Response streamed back to client  

### Key Design Notes

- OpenAI API keys are handled **server-side only**
- The client receives a short-lived `client_secret` for ChatKit sessions
- The workflow and retrieval logic live entirely within OpenAI Agent Builder
- The frontend serves purely as a demo interface

---

## Features

- Collapsible floating chat widget  
- Secure server-side session handling  
- Workflow-driven responses  
- Grounded answers using structured retrieval  
- Minimal UI for rapid testing and iteration  

---

## Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment Variables

Create a `.env.local` file in the root directory:

```
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## Deployment

This application is deployed on **Vercel**.

To deploy your own version:

1. Push the repository to GitHub  
2. Import the repository into Vercel  
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
4. Deploy  

For production domains, ensure the domain is allowlisted in the OpenAI organization security settings if required.

---
