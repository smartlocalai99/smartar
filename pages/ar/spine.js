import dynamic from 'next/dynamic';
const SpineArScene = dynamic(() => import('../../components/SpineArScene'), { ssr: false });
export default function SpinePage() { return <SpineArScene />; }
