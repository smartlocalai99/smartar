import HeartArScene from './HeartArScene';
import { SPINE_ASSET_PATHS, SPINE_HOTSPOTS } from './spineContent';

export default function SpineArScene() {
  return (
    <HeartArScene
      assetPaths={SPINE_ASSET_PATHS}
      modelAssetId="spineModelAsset"
      modelPosition="0 -0.035 0.012"
      modelLocalPosition="0.086 -0.778 0"
      modelRotation="-8 0 0"
      modelScale="0.036 0.036 0.036"
      hotspots={SPINE_HOTSPOTS}
    />
  );
}
