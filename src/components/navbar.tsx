import React from "react";

export const NavBar: React.FC = () => {
  return (
    <div className="navbar sticky top-0 bg-base-100 shadow-md">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">hr0</a>
      </div>
      <div className="navbar-end space-x-2">
        <a className="btn">Create Account</a>
        <a className="btn-primary btn">Sign In</a>
      </div>
    </div>
  );
};
