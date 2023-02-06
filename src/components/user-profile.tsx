import Image from "next/image";

interface UserProfileProps {
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  email?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  givenName = "",
  familyName = "",
  avatarUrl,
  email,
}) => {
  const fullName = `${givenName} ${familyName}`.trim();

  return (
    <div className="flex flex-row">
      {avatarUrl && (
        <div className="avatar">
          <div className="mt-1 h-8 w-8 rounded-full">
            <Image src={avatarUrl} alt={fullName} width={50} height={50} />
          </div>
        </div>
      )}
      <div className="p-2">
        <span>{email}</span>
      </div>
    </div>
  );
};
