import { Link } from "react-router-dom";
import LOGO from "../../../public/assets/images/logo.svg";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DEFAULTAVATAR from "../../../public/assets/icons/profile-placeholder.svg";
import { useUserContext } from "@/context/authContext";
const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link
          to="/"
          className="flex gap-3 items-center"
        >
          <img
            src={LOGO}
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
            />
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex-center gap-3"
          >
            <img
              src={user.imageUrl || DEFAULTAVATAR}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
