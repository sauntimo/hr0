import { type NextPage } from "next";
import Image from "next/image";
import { Layout } from "../components/layout";

const Landing: NextPage = () => {
  return (
    <Layout title="Home">
      <Hero />
      <div className="flex flex-col space-x-0 space-y-4 pt-16 md:flex-row md:space-x-16 md:space-y-0">
        <FeatureCard
          title="Pointing at things"
          text="This person seems to thing they are jousting. Best avoided."
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
    </Layout>
  );
};

export default Landing;

const Hero: React.FC = () => {
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
          <button className="btn-primary btn">Get Started</button>
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
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="flex h-full flex-col justify-between">
        <figure className="px-8 pt-8">
          <Image src={image} alt={imageAlt} width="300" height="300" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="">{text}</p>
        </div>
      </div>
    </div>
  );
};
