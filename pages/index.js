import { parseCookies } from "nookies";
export async function getServerSideProps(ctx) {

  const { token } = parseCookies(ctx);
      return {
          redirect: {
              destination: (token ? '/Sistema' : '/Login'),
              permanent: false
          }
      }
}

export default function Index() {
    return (null);
}