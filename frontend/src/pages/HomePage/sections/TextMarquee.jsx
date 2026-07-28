import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../utils/authFetch";

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    className="text-[#CC0D39] rotate-star mr-3 shrink-0 mt-1"
  >
    <path
      fill="currentColor"
      d="M0 6c3 0 6-3 6-6 0 3 3 6 6 6-3 0-6 3-6 6 0-3-3-6-6-6Z"
    />
  </svg>
);

const TextMarquee = () => {
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const result = await apiRequest("/api/WAP/Announcement/GetAll");
      return (result.data || []).filter((a) => a.isActive);
    },

    retry: false,
  });

  const messages =
    announcements.length > 0
      ? announcements.map((a) => a.messageText)
      : ["We offer the best products & deals!"];

  const scrollingMessages = [...messages, ...messages];

  return (
    <>
      <div className="relative w-full bg-[#fffaf5] border-y border-[#e4e4e7] py-3 sm:rotate-marquee">
        <div className="overflow-hidden">
          <div className="marquee-track">
            {scrollingMessages.map((msg, idx) => (
              <div
                key={idx}
                className="marquee-item inline-flex items-center gap-2 mr-32 text-sm sm:text-base font-medium text-[#111111] select-none"
              >
                <StarIcon />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }

        .rotate-marquee {
          transform: rotate(-1.5deg);
        }

        .rotate-marquee::after {
          content: "";
          position: absolute;
          top: 100%;
          left: -10%;
          right: -10%;
          height: 40px;
          background: #f9f1eb;
          pointer-events: none;
        }

        .marquee-track:hover {
          animation-play-state: paused;
          cursor: pointer;
        }

        .rotate-star {
          animation: rotateStar 3s ease-in-out infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes rotateStar {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
      `}</style>
    </>
  );
};

export default TextMarquee;
