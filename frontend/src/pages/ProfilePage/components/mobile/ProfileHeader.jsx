import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { useUser } from "../../../../hooks/useUser";
import bagImage from "../../../../assets/profile-bag.png";
// Imports End-------

const ProfileHeader = () => {
  const user = useUser();
  return (
    <div className="relative overflow-x-hidden pb-0">
      <div className="bg-[#fffaf5] pt-10 pb-10 px-6 rounded-b-[20px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
      </div>

      {/* Welcome Card */}
      <div className="mx-2 -mt-20 bg-[#fffaf5] p-4 rounded-[15px] relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span className="text-[14px] font-black text-[#E14A5C] flex items-center gap-2">
              Hi {user ? user.partyName?.split(" ")[0] : "there"}!{" "}
              <span className="text-lg">👋</span>
            </span>

            <h1 className="text-[26px] font-black text-gray-900 leading-tight tracking-tight">
              {user ? "Welcome Back!" : "Welcome!"}
            </h1>

            <p className="sm:text-[15px] text-[13px] text-gray-400 font-medium mt-1 leading-relaxed max-w-45">
              {user
                ? "Manage your orders, wishlist & preferences."
                : "Sign in to manage your orders and preferences."}
            </p>
          </div>

          <div className="relative w-28 h-28 shrink-0 mt-2">
            {/* Soft Glow/Shadow for 3D effect */}
            <div className="absolute bg-purple-400/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Particles/Blobs */}
            <div className="absolute top-2 right-4 w-5 h-5 bg-pink-300/60 rounded-full blur-md animate-blob"></div>
            <div className="absolute bottom-8 left-0 w-4 h-4 bg-blue-300/50 rounded-full blur-sm animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 -left-2.5 w-6 h-6 bg-purple-300/40 rounded-full blur-lg animate-blob animation-delay-4000"></div>
            <div className="absolute top-6 left-8 w-2 h-2 bg-pink-400/60 rounded-full blur-[2px]"></div>
            <div className="absolute top-1/4 right-2 w-3 h-3 bg-blue-200/40 rounded-full blur-sm animate-blob animation-delay-1000"></div>
            <div className="absolute bottom-2 right-10 w-4 h-4 bg-purple-200/50 rounded-full blur-md animate-blob animation-delay-3000"></div>
            <div className="absolute -top-1.25 left-1/3 w-3 h-3 bg-pink-200/50 rounded-full blur-md animate-blob animation-delay-5000"></div>
            <div className="absolute bottom-1/2 right-4 w-2 h-2 bg-blue-400/30 rounded-full blur-[1px] animate-pulse"></div>

            <img
              src={bagImage}
              alt="Shopping Bag"
              className="w-full h-full relative z-10 transform ease-out drop-shadow-xl"
            />
          </div>
        </div>

        {!user && (
          <div className="flex items-center gap-3 mt-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-linear-to-r from-[#FF4D6D] via-[#FF4D6D] to-[#8E2DE2] text-white rounded-full font-extrabold text-[13px] text-center shadow-[0_10px_25px_-5px_rgba(255,77,109,0.4)] active:scale-[0.97] transition-all duration-300"
            >
              Login / Register
            </Link>

            <span className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#27AE60]/5">
              <ShieldCheck size={16} className="text-[#27AE60]" />
              <span className="text-[11px] sm:text-[12px] font-bold text-gray-600 whitespace-nowrap">
                Secure & Easy
              </span>
            </span>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-5%) rotate(-10deg);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0) rotate(10deg);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(10px, -15px) scale(1.1);
          }
          66% {
            transform: translate(-10px, 10px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `,
        }}
      />
    </div>
  );
};

export default ProfileHeader;
