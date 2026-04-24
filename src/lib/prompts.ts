const SKIN_TONE_LABELS: Record<string, string> = {
  very_light: "very light / pale",
  light: "light",
  medium: "medium / olive",
  tan: "tan / brown",
  dark: "deep / dark brown",
};

const EYE_COLOR_LABELS: Record<string, string> = {
  brown: "brown", black: "dark black", blue: "blue", green: "green", hazel: "hazel", gray: "gray",
};

const HAIR_COLOR_LABELS: Record<string, string> = {
  black: "black", dark_brown: "dark brown", brown: "brown", light_brown: "light brown",
  blonde: "blonde", red: "red / auburn", gray: "gray", white: "white / platinum",
};

const HAIR_STYLE_LABELS: Record<string, string> = {
  straight: "straight", wavy: "wavy", curly: "curly", short: "short",
  long: "long and loose", bun: "bun / updo", ponytail: "ponytail",
};

export const AVATAR_SYSTEM_PROMPT = ({
  heightCm,
  weightKg,
  bustCm,
  waistCm,
  hipsCm,
  skinTone,
  eyeColor,
  hairColor,
  hairStyle,
  extraNotes,
}: {
  heightCm?: number;
  weightKg?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  skinTone?: string;
  eyeColor?: string;
  hairColor?: string;
  hairStyle?: string;
  extraNotes?: string;
}) =>
  `Photorealistic full-body avatar from reference photos. Front-facing, relaxed pose, arms slightly from body, full body head to feet visible. White background, soft studio light. Black sports bra + black bike shorts.
Skin: ${skinTone ? SKIN_TONE_LABELS[skinTone] : "from photo"}. Eyes: ${eyeColor ? EYE_COLOR_LABELS[eyeColor] : "from photo"}. Hair: ${hairColor ? HAIR_COLOR_LABELS[hairColor] : "from photo"}, ${hairStyle ? HAIR_STYLE_LABELS[hairStyle] : "from photo"}.
${heightCm ? `Height ${heightCm}cm.` : ""} ${weightKg ? `Weight ${weightKg}kg.` : ""} ${bustCm ? `Bust ${bustCm}cm.` : ""} ${waistCm ? `Waist ${waistCm}cm.` : ""} ${hipsCm ? `Hips ${hipsCm}cm.` : ""} ${extraNotes?.trim() ? extraNotes.trim() : ""}
Single image, no text, no watermarks.`;

export const AVATAR_BACK_PROMPT = () =>
  `Generate the BACK VIEW of this person's full-body avatar. Use the provided front-view avatar image as reference.

- Show the exact same person from behind (back-facing pose)
- Same outfit: black sports bra + black bike shorts
- Same body proportions, hair, skin tone
- Pose: standing straight, arms slightly away from body, facing away from camera
- Framing: full body, head to feet, both feet visible, small margin below feet, no cropping
- Background: white (#FFFFFF)
- Lighting: soft studio light

Single photorealistic image, no text, no watermarks.`;

export const TRYON_SYSTEM_PROMPT = () =>
  `Virtual try-on. Two input images: 1) person, 2) garment.

- Dress the person in the garment realistically
- Keep face, body, pose, skin tone exactly as-is
- Match garment color, texture, cut, and details accurately
- Keep original background
- Show full body head to feet, both feet visible, no cropping

Single photorealistic image, no text, no watermarks.`;
