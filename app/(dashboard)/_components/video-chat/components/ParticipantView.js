import ReactPlayer from "react-player";

const ParticipantsViewer = ({ isPresenting, sideBarMode }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <ReactPlayer
          playsinline
          playIcon={<></>}
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover'
          }}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      </div>
    </div>
  );
};

export default ParticipantsViewer;
