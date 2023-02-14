import React from "react";

import { Layout } from "../components/layout/layout";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <Layout title="Home">
      <div className="width-full">
        <Hero />
        <div className="flex flex-col items-center space-x-0 space-y-4 pt-16 md:flex-row md:justify-around md:space-x-4 md:space-y-0">
          <FeatureCard
            title="Pointing at things"
            text="This person seems to think they are jousting. Best avoided."
            image="/images/undraw_blogging.svg"
            imageAlt="Person weilding a stick"
          />
          <FeatureCard
            title="Paper"
            text="These people are holding some paper. Maybe they are from the past?"
            image="/images/undraw_working.svg"
            imageAlt="People holding paper"
          />
          <FeatureCard
            title="Look, it's Dave"
            text="Dave invited you for drinks last week and you never replied. He's waving at you now. Perhpas you should fake a phone call..."
            image="/images/undraw_hello.svg"
            imageAlt="Dave is waving at you"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Landing;

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const handleGetStarted = (): void => {
    // if we are already authed, redirect
    if (isAuthenticated) {
      navigate("/account");
      return;
    }

    // otherwise redirect to sign up
    navigate("/new-organization");
  };

  return (
    <div className="hero h-96 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hey, we're hr0 👋</h1>
          <p className="py-6">
            hr0 is like many of the other, better, "real" HR platforms you're
            already familiar with, only we have 0 idea about HR. So, there's
            that.
          </p>
          <button className="btn-primary btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  title: string;
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  imageAlt,
  title,
  text,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl sm:h-96 sm:w-96">
      <div className="flex h-full flex-col justify-between">
        <figure className="px-8 pt-8">
          <img src={image} alt={imageAlt} width="300" height="300" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="">{text}</p>
        </div>
      </div>
    </div>
  );
};
