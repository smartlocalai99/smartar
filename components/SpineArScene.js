import HeartArScene from './HeartArScene';
import { SPINE_ASSET_PATHS } from './spineContent';

export default function SpineArScene() {
  return (
    <HeartArScene
      assetPaths={SPINE_ASSET_PATHS}
      modelAssetId="spineModelAsset"
      modelPosition="0 0 0.035"
      modelScale="0.032 0.032 0.032"
    />
  );
}
