import React from 'react';
import './main.css';

interface User {
  name: string;
  email: string;

  bio?: string;
}

interface UserProfileProps {
  user: User;
}

 export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <img
        src={ 'https://cdn-icons-png.flaticon.com/512/5580/5580993.png'}
        alt={`${user.name}'s avatar`}
        className="profile-avatar"
      />
      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || 'No bio available.'}</p>
    </div>
  );
};