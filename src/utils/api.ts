import { ToxicityResponse } from "./types";

export const analyzeToxicity = async (text: string): Promise<number | null> => {
  try {
    const response = await fetch("http://localhost:5000/api/analyse-toxicity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze toxicity");
    }

    const data: ToxicityResponse = await response.json();
    return data.toxicity;
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    return null;
  }
};
