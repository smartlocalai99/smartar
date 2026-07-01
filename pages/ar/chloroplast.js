import dynamic from 'next/dynamic';
const ChloroplastArScene = dynamic(() => import('../../components/ChloroplastArScene'), { ssr: false });
export default function ChloroplastPage() { return <ChloroplastArScene />; }
