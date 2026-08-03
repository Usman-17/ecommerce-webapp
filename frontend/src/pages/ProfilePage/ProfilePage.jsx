import DesktopProfileView from "./components/DesktopProfileView";
import MobileProfileView from "./components/MobileProfileView";
// Imports End--------

const ProfilePage = () => {
  return (
    <>
      {/* Desktop Dashboard */}
      <div className="hidden md:block">
        <DesktopProfileView />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileProfileView />
      </div>
    </>
  );
};

export default ProfilePage;
