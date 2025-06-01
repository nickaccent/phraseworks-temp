const BoxView = ({ files, ShowDetails }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {files.map((file, idx) => {
        const thumbnail =
          file?.attachment_metadata?.sizes?.find((item) => item.slug === 'thumbnail')?.file ||
          file?.filename;

        return (
          <button
            type="button"
            key={idx}
            className="w-[150px] flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => ShowDetails(file.id)}
          >
            <img
              src={`http://localhost:8787/r2/${thumbnail}`}
              className="w-[150px] h-[150px] object-cover"
              alt={file?.post_title || file?.filename}
            />
            <span className="w-full text-center break-words whitespace-normal text-sm overflow-hidden line-clamp-2">
              {file.filename}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BoxView;
