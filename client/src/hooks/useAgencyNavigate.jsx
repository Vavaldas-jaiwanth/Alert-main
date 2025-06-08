import { useNavigate, useLocation } from "react-router-dom";

const useAgencyNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const agencyKey = params.get("key");

  return (path, options = {}) => {
    // Add `?key=value` if not already present
    const url = path.includes("?")
      ? `${path}&key=${agencyKey}`
      : `${path}?key=${agencyKey}`;
    navigate(url, options);
  };
};

export default useAgencyNavigate;
