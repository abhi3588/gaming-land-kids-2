// Map of activity id -> public image path (relative to base)
export const ACTIVITY_IMAGES = {
  'rainbow-hunt': 'images/Fun-RainbowHunt.png',
  'story-dice': 'images/Fun-StoryDice.png',
  'shape-collage': 'images/Fun-ShapeCollage.png',
  'breathing-star': 'images/Fun-BreathingStar.png',
  'kitchen-band': 'images/Fun-KitchenBand.png',
  'kindness-coupons': 'images/Fun-KindnessCoupons.png',
  'nature-journal': 'images/Nature_Journal.png',
  'sock-puppet-show': 'images/Sock_Puppet_Show.png',
  'shadow-puppets': 'images/Fun-ShadowPuppets.png',
  'bubble-sculptures': 'images/Fun-BubbleSculptures.png',
  'magic-milk-art': 'images/Fun-MagicalMilkArt.png',
  'solar-oven-maker': 'images/Fun-SolarOven.png',
};

export function getActivityImageUrl(id) {
  const path = ACTIVITY_IMAGES[id];
  return path ? `${import.meta.env.BASE_URL}${path}` : null;
}
