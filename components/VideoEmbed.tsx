type Props = {
  youtubeId: string;
  title: string;
};

export function VideoEmbed({ youtubeId, title }: Props) {
  if (!youtubeId) {
    return (
      <div className="flex aspect-video items-center justify-center border border-line bg-bg-2 px-6 text-center">
        <div className="max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-4">
            ▶ Video
          </div>
          <h3 className="font-serif text-2xl font-normal text-ink">Video in Produktion</h3>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
            Dieses Modul wird als Lernvideo aufbereitet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-line">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
