import "dotenv/config";

const getOpenAIAPIResponse = async (messages) => {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-5.6-luna",
                    messages
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI API Error:", data);

            throw new Error(
                data.error?.message ||
                "OpenAI API request failed"
            );
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("OpenAI Error:", err);
        throw err;
    }
};

export default getOpenAIAPIResponse;