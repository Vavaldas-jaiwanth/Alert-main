import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AgencyCheck = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyFromQuery = params.get("key");

  const expectedKey = process.env.REACT_APP_AGENCY_KEY || "india1";

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false); // ensure check is done

  useEffect(() => {
    const authorized =
      localStorage.getItem("agency_auth") === "true" &&
      keyFromQuery === expectedKey;

    if (keyFromQuery === expectedKey) {
      localStorage.setItem("agency_auth", "true");
      setIsAuthorized(true);
    } else {
      // If key is wrong or missing, revoke access
      localStorage.removeItem("agency_auth");
      setIsAuthorized(false);
    }

    setChecked(true); // mark that check is complete
  }, [keyFromQuery, expectedKey]);

  if (!checked) return null; // Don't render anything until check completes

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AgencyCheck;
