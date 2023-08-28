'use client';

import { signOut } from 'next-auth/react';

function LogoutButton() {
  const handleSignOut = () => signOut();

  return (
    <>
      <button
        className="font-['DiaGothicBold'] ml-4 text-[#6B99C3] text-xl mb-1 hover:text-[#0C151C]"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </>
  );
}

export { LogoutButton };
