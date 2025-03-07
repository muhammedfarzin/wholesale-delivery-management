import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">404</h1>
      <div className="text-base font-bold">Page Not Found</div>
      <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default PageNotFound;
