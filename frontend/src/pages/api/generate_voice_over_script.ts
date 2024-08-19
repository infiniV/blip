// Example: src/pages/api/generate_voice_over_script.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    "http://127.0.0.1:5000/generate_voice_over_script",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    }
  );
  const data = await response.json();
  res.status(200).json(data);
}
