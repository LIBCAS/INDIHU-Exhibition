import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { useQuery } from "hooks/use-query";

// Components
import ComponentLoader from "components/loaders/component-loader";

// Models
import { AppDispatch } from "store/store";

// Actions and utils
import { fetcher } from "utils/fetcher";
import { parseToken } from "actions/user-actions";
import { setOAuthLoginResponseType } from "actions/app-actions";

// - -

const OAuthProviderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const { providerName } = useParams<{ providerName: string }>();

  const urlSearchParams = useQuery(); // custom hook
  const codeQueryValue = urlSearchParams.get("code");

  useEffect(() => {
    const handleOAuth = async () => {
      window.localStorage.removeItem("token");

      if (!providerName) {
        dispatch(
          setOAuthLoginResponseType({
            providerName: "",
            oAuthResponseType: "missingProviderNameUrlParam",
          })
        );
        history.push("/");
        return;
      }

      if (!codeQueryValue) {
        dispatch(
          setOAuthLoginResponseType({
            providerName: providerName,
            oAuthResponseType: "missingProviderCodeUrlQuery",
          })
        );
        history.push("/");
        return;
      }

      // Response from our indihu BE, which we are contacting after got redirected from OAuth provider with the codeValue
      // /oauth/:providerName?code={codeValue}
      const response = await fetcher(
        `/api/oauth/${providerName}?code=${codeQueryValue}`
      );

      if (response.status === 200) {
        // OK, successful login
        const bearerTokenWhole = await response.text();
        const token = bearerTokenWhole.split(" ")[1];
        dispatch(parseToken(token)); // returns boolean
        history.push("/profile");
      } else if (response.status === 201) {
        // User registered, set in TO_ACCEPT state and needs to be accepted by some admin before letting into the system
        dispatch(
          setOAuthLoginResponseType({
            providerName: providerName,
            oAuthResponseType: "waitingForAdminAccept",
          })
        );
        history.push("/");
      } else if (response.status === 400) {
        // Public email is not set in the oauth provider profile
        dispatch(
          setOAuthLoginResponseType({
            providerName: providerName,
            oAuthResponseType: "publicEmailError",
          })
        );
        history.push("/");
      } else if (response.status === 412) {
        // User previosly registered, is in TO_ACCEPT state and was not accepted by admin yet
        dispatch(
          setOAuthLoginResponseType({
            providerName: providerName,
            oAuthResponseType: "stillNotAcceptedError",
          })
        );
        history.push("/");
      } else {
        // Other error
        dispatch(
          setOAuthLoginResponseType({
            providerName: providerName,
            oAuthResponseType: "otherError",
          })
        );
        history.push("/");
      }
    };

    handleOAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeQueryValue, providerName]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ComponentLoader />
    </div>
  );
};

export default OAuthProviderPage;
