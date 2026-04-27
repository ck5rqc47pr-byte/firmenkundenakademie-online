type Props = {
  youtubeId: string;
  title: string;
};

export function VideoEmbed({ youtubeId, title }: Props) {
  if (!youtubeId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[2rem] bg-primary px-6 text-center text-white shadow-card">
        <div className="max-w-md">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl">
            ▶
          </div>
          <h3 className="text-2xl font-semibold">Video in Produktion</h3>
          <p className="mt-3 text-sm text-white/80">
            Dieses Modul wird derzeit als Lernvideo aufbereitet und bald verfügbar sein.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
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
