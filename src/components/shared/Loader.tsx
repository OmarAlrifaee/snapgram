import LoaderImg from "../../../public/assets/icons/loader.svg";
const Loader = () => {
  return (
    <div className="flex-center w-full animate-spin">
      <img
        src={LoaderImg}
        alt="loader"
        width={24}
        height={24}
      />
    </div>
  );
};

export default Loader;
