export default function VideoEmbed({ videoId, title = "Vídeo complementar" }) {
  return (
    <div
      className="w-full my-6"
      style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
