import { getEmbedURL } from "./getEmbedURL";
export interface VideoProps {
  src: string;
}
export default function VideoEmbed({ src }: VideoProps) {
  // https://github.com/EduBeyond/youtube-url-to-embed

  const video_id = getEmbedURL(src);
  if (!video_id) {
    return null;
  }

  return (
    <div className="overflow-hidden my-4">
      <iframe
        width="560"
        height="315"
        src={video_id}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
