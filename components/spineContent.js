export const SPINE_ASSET_PATHS = {
  model: '/models/spine.glb',
  poster: '/posters/spine.png',
  target: '/targets/spine.mind',
};

export const SPINE_HOTSPOTS = [
  {
    id: 'cervical', number: 1, title: 'Cervical Spine', position: '0.28 0.68 0.08',
    neet: 'The cervical region contains the upper vertebrae that support the head and protect the spinal cord.',
    patient: 'This is the neck part of the spine.',
    keyPoint: 'Helps in neck movement and protects important nerves.',
  },
  {
    id: 'thoracic', number: 2, title: 'Thoracic Spine', position: '-0.28 0.28 0.08',
    neet: 'The thoracic vertebrae connect with ribs and help protect organs in the chest cavity.',
    patient: 'This is the upper and middle back region.',
    keyPoint: 'Provides stability and supports the rib cage.',
  },
  {
    id: 'lumbar', number: 3, title: 'Lumbar Spine', position: '0.3 -0.18 0.08',
    neet: 'The lumbar vertebrae are larger because they bear more body weight.',
    patient: 'This is the lower back region where pain commonly occurs.',
    keyPoint: 'Supports body weight and helps bending movements.',
  },
  {
    id: 'degeneration', number: 4, title: 'Disc Degeneration', position: '-0.3 -0.38 0.08',
    neet: 'Intervertebral discs act as cushions between vertebrae. Degeneration reduces cushioning.',
    patient: 'The soft cushion between bones becomes weak or worn out.',
    keyPoint: 'Can cause back pain and stiffness.',
  },
  {
    id: 'compression', number: 5, title: 'Nerve Compression', position: '0.3 -0.52 0.08',
    neet: 'Compression of spinal nerves can affect signal transmission between the spinal cord and body parts.',
    patient: 'A nerve is getting pressed, which can cause pain, tingling, or numbness.',
    keyPoint: 'Commonly causes radiating leg or arm pain.',
  },
  {
    id: 'treatment', number: 6, title: 'Treatment Target', position: '-0.3 -0.66 0.08',
    neet: 'Imaging helps doctors identify the exact region for treatment planning.',
    patient: 'This shows the area doctors may focus on during treatment.',
    keyPoint: 'Helps explain treatment clearly to patients.',
  },
];

export const DEFAULT_SPINE_HOTSPOT = SPINE_HOTSPOTS[0];
