export default async function handler(
  req: { body: { images_guide: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: any): void; new (): any };
    };
  }
) {
  const { images_guide } = req.body;
  const response = await fetch("http://127.0.0.1:5000/generate_images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ images_guide }),
  });
  const data = await response.json();
  res.status(200).json(data);
}
