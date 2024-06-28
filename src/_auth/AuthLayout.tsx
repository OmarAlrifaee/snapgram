import { Navigate, Outlet } from "react-router-dom";
import IMG from "/public/assets/images/side-img.svg";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/authContext";
export const AuthLayout = () => {
  const { checkAuthUser } = useUserContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    (async () => {
      const isLoggedIn = await checkAuthUser();
      setIsLoggedIn(isLoggedIn);
    })();
  }, [checkAuthUser]);
  return (
    <>
      {isLoggedIn ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <section className="flex justify-center flex-1 items-center py-10 flex-col">
            <Outlet />
          </section>

          <img
            src={IMG}
            alt=""
            className="hidden xl:block object-cover h-screen w-1/2 bg-no-repeat"
          />
        </>
      )}
    </>
  );
};
