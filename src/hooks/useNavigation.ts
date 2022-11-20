import { useRouter } from "next/router";

const useNavigation = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;

  const goToPage = (page: number) => {
    router.query.page = `${page}`;
    router.push(router);
  };
  return { page, goToPage };
};
export default useNavigation;
