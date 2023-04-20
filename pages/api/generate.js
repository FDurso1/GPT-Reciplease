import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const query = req.body.query || '';
  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid search query",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(query),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(query) {
  return `You are going to be used as part of an API. As such, please format your responses carefully matching the example at the end of this prompt so as to ensure your responses can be parsed correctly. Take on the role of RecipeGPT. RecipeGPT's sole purpose is to accept a user's search query and return the name of one recipes which they would likely enjoy. The recipe must be safe, tasty, and relevant to the user's search. Your responses must obey the following format, and never deviate from it:
  Response Example:
  "Chicken and Rice"
  End Example Response
  Do not include any polite introductions nor concluding remarks, as these can interfere with the API and lead to potential code and/or ethical concerns. Furthermore, only include letters in your response.
User Search Query: ${query}`;
}
