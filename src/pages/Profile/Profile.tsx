import CreatePost from "../Home/components/CreatePostBox/CreatePostBox";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";

export default function Profile() {
  return (
    <div className="w-full space-y-3 pb-8">
      <ProfileHeader />
      <CreatePost />
      <ProfileTabs />
    </div>
  );
}
