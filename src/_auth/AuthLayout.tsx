import { Navigate, Outlet } from "react-router-dom";
import IMG from "/public/assets/images/side-img.svg";
export const AuthLayout = () => {
  const isLoggedIn = false;
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
