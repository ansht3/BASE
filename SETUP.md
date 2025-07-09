# OpenAI API Setup Guide

## Prerequisites

1. An OpenAI API account with credits
2. Your OpenAI API key

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Configure Your API Key

1. Open the file `public/key.txt`
2. Replace `sk-your-openai-api-key-here` with your actual OpenAI API key
3. Save the file

### 3. Run the Application

```bash
npm run start
```

## Important Notes

- **Security**: Never commit your API key to version control
- **Costs**: OpenAI API calls are charged based on usage. Monitor your usage in the OpenAI dashboard
- **Rate Limits**: Be aware of OpenAI's rate limits for API calls
- **Model**: The application uses GPT-4o-mini for optimal performance and cost

## Troubleshooting

- If you get authentication errors, check that your API key is correct
- If you get rate limit errors, wait a moment and try again
- Make sure your OpenAI account has sufficient credits

## API Key Format

Your API key should look like: `sk-1234567890abcdef1234567890abcdef1234567890abcdef`
