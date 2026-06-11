type Props = {
  youtubeId: string;
  title: string;
};

export function VideoEmbed({ youtubeId, title }: Props) {
  // Kein Platzhalter mehr: Solange kein Video hinterlegt ist, wird nichts angezeigt (D5).
  if (!youtubeId) {
    return null;
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
