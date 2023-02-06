import React from "react";
import Image from "next/image";

export const PageLoader: React.FC = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="loader">
      <Image src={loadingImg} alt="Loading..." width={200} height={200} />
    </div>
  );
};
