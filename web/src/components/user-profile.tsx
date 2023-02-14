interface UserProfileProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name = "",
  email,
  avatarUrl,
}) => {
  const fullName = name.trim() ?? email;

  return (
    <div className="flex flex-row">
      {avatarUrl && (
        <div className="avatar">
          <div className="mt-1 h-8 w-8 rounded-full">
            <img src={avatarUrl} alt={fullName} width={50} height={50} />
          </div>
        </div>
      )}
      <div className="p-2">
        <span>{name}</span>
      </div>
    </div>
  );
};
