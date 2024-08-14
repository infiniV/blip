export default async function handler(
  req: { body: { "voice-over": any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: any): void; new (): any };
    };
  }
) {
  const { "voice-over": voiceOver } = req.body;
  const response = await fetch(
    "http://192.168.122.237:5000/generate_image_description",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "voice-over": voiceOver }),
    }
  );
  const data = await response.json();
  res.status(200).json(data);
}
