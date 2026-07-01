import dynamic from 'next/dynamic';

const HeartArScene = dynamic(() => import('../../components/HeartArScene'), {
  ssr: false,
});

export default function HeartPage() {
  return <HeartArScene />;
}
