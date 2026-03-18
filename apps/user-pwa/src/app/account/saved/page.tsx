import type { Metadata } from 'next';
import SavedArtistsClient from './SavedArtistsClient';

export const metadata: Metadata = {
  title: '保存したアーティスト | TattooBase',
  description: '保存（お気に入り）したアーティストや作品の一覧を確認できます。',
};

export default function SavedPage() {
  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">保存したアーティスト</h1>
        <p className="text-neutral-500 text-sm">検討中のタトゥーアーティスト・スタジオのリスト</p>
      </div>
      <SavedArtistsClient />
    </div>
  );
}
