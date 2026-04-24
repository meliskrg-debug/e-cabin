import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function generateTryon({
  personImageUrl,
  garmentImageUrl,
}: {
  personImageUrl: string;
  garmentImageUrl: string;
}): Promise<string> {
  const output = await replicate.run(
    "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
    {
      input: {
        human_img: personImageUrl,
        garm_img: garmentImageUrl,
        garment_des: "clothing item",
        is_checked: true,
        is_checked_crop: false,
        denoise_steps: 30,
        seed: 42,
      },
    }
  );

  if (Array.isArray(output) && output[0]) {
    return output[0] as string;
  }
  if (typeof output === "string") {
    return output;
  }
  throw new Error("Replicate returned no image.");
}

export async function generateAvatar({
  face1Url,
  face2Url,
  bodyUrl,
  prompt,
}: {
  face1Url: string;
  face2Url: string;
  bodyUrl: string;
  prompt: string;
}): Promise<string> {
  const output = await replicate.run(
    "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4af4a36869950f352acd8f2b89f97a07d9",
    {
      input: {
        prompt,
        image: bodyUrl,
        strength: 0.5,
        guidance_scale: 7.5,
        num_outputs: 1,
      },
    }
  );

  if (Array.isArray(output) && output[0]) {
    return output[0] as string;
  }
  if (typeof output === "string") {
    return output;
  }
  throw new Error("Replicate returned no image.");
}
