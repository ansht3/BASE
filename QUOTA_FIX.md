# OpenAI API Quota Issue - Resolution Guide

## Current Issue

You're getting a 429 error: "You exceeded your current quota, please check your plan and billing details."

## Solutions

### Option 1: Add Credits to Your OpenAI Account (Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in to your account
3. Navigate to "Billing" in the left sidebar
4. Click "Add payment method" or "Add credits"
5. Add funds to your account
6. The application will work normally once credits are added

### Option 2: Use Demo Mode (Temporary)

The application now includes a demo mode that works without API calls:

- Try prompts like:
  - "Add a div with header"
  - "Create a button"
  - "Add a paragraph"

### Option 3: Use a Different API Key

1. Create a new OpenAI account
2. Get a new API key
3. Replace the key in `public/key.txt`

### Option 4: Switch to a Different Model

If you want to use a cheaper model, you can modify the code to use:

- `gpt-3.5-turbo` (cheaper but less capable)
- `gpt-4o` (more expensive but more capable)

## Status Indicators

The application now shows status indicators:

- 🟢 **Green**: API working normally
- 🟠 **Orange**: Demo mode (quota exceeded)
- 🔴 **Red**: API error (check key or billing)

## Testing

1. Try the demo mode first to verify the application works
2. Add credits to your OpenAI account
3. Test with real API calls

## Cost Estimates

- GPT-4o-mini: ~$0.00015 per 1K input tokens
- Typical prompt: ~$0.001-0.01 per request
- 100 requests ≈ $0.10-1.00
