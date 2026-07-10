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
};

export function getActivityImageUrl(id) {
  const path = ACTIVITY_IMAGES[id];
  return path ? `${import.meta.env.BASE_URL}${path}` : null;
}
