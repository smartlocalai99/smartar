export const HEART_ASSET_PATHS = {
  model: '/models/heart.glb',
  bloodFlowModel: '/models/heart-bloodflow.glb',
  target: '/targets/heart-poster.mind',
  poster: '/posters/heart-poster.png',
};

export const HEART_TOPICS = [
  'default',
  'aorta',
  'leftVentricle',
  'rightAtrium',
  'valves',
  'bloodFlow',
];

export const HEART_CONTENT = {
  default: {
    title: 'Human Heart',
    text:
      'The human heart is a four-chambered muscular organ responsible for double circulation: pulmonary circulation and systemic circulation.',
  },
  aorta: {
    title: 'Aorta',
    text: 'The aorta carries oxygen-rich blood from the left ventricle to the entire body. NEET point: Aorta is the largest artery.',
  },
  leftVentricle: {
    title: 'Left Ventricle',
    text:
      'The left ventricle pumps oxygenated blood into the aorta. NEET point: It has the thickest muscular wall because it pumps blood to the whole body.',
  },
  rightAtrium: {
    title: 'Right Atrium',
    text:
      'The right atrium receives deoxygenated blood from the body through the superior and inferior vena cava.',
  },
  valves: {
    title: 'Valves',
    text:
      'Heart valves prevent backflow of blood. NEET point: Tricuspid valve is on the right side, bicuspid/mitral valve is on the left side.',
  },
  bloodFlow: {
    title: 'Blood Flow',
    text:
      'Deoxygenated blood goes from body → right atrium → right ventricle → lungs. Oxygenated blood goes from lungs → left atrium → left ventricle → aorta → body.',
  },
};

export const HEART_DISCLOSURE =
  'For NEET educational demonstration only. Not for diagnosis or treatment.';

export const HEART_BUTTONS = [
  { key: 'aorta', label: 'Aorta' },
  { key: 'leftVentricle', label: 'Left Ventricle' },
  { key: 'rightAtrium', label: 'Right Atrium' },
  { key: 'valves', label: 'Valves' },
  { key: 'bloodFlow', label: 'Blood Flow' },
];
