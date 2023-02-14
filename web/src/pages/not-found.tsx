import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout title="Not Found">
      <Container title="Not Found">
        <p>
          Ooops, sorry, it looks like you've got lost somewhere. Want to{" "}
          <a href="/">go back home?</a>
        </p>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;
