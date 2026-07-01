import HeartArScene from './HeartArScene';
import { CHLOROPLAST_ASSET_PATHS } from './chloroplastContent';

export default function ChloroplastArScene() {
  return (
    <HeartArScene
      assetPaths={CHLOROPLAST_ASSET_PATHS}
      modelAssetId="chloroplastModelAsset"
      modelPosition="0 0 0.035"
      modelScale="0.35 0.35 0.35"
    />
  );
}
