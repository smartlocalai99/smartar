import dynamic from 'next/dynamic';
const AnimalCellArScene = dynamic(() => import('../../components/AnimalCellArScene'), { ssr: false });
export default function AnimalCellPage() { return <AnimalCellArScene />; }
