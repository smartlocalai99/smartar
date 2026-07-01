import HeartArScene from './HeartArScene';
import { ANIMAL_CELL_ASSET_PATHS } from './animalCellContent';

export default function AnimalCellArScene() {
  return (
    <HeartArScene
      assetPaths={ANIMAL_CELL_ASSET_PATHS}
      modelAssetId="animalCellModelAsset"
      modelPosition="0 0 0.035"
      modelScale="3.5 3.5 3.5"
    />
  );
}
