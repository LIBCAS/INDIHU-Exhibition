import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Components
import LogoutAppHeader from "./LogoutAppHeader";
import LoginAppHeader from "./LoginAppHeader";
import { AppBar, Toolbar } from "@mui/material";

// Models
import { AppState } from "store/store";
import { ActiveExpo, Screen } from "models";

// Utils
import { isAdmin } from "utils";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo as ActiveExpo,
  ({ expo }: AppState) => expo.activeScreen as Screen,
  ({ user }: AppState) => user.userName,
  ({ user }: AppState) => user.role,
  (activeExpo, activeScreen, userName, role) => ({
    activeExpo,
    activeScreen,
    userName,
    role,
  })
);

// - -

type AppHeaderProps = {
  authStyle?: boolean;
  expositionsStyle?: boolean;
  expoStyle?: boolean;
  screenStyle?: boolean;
  adminStyle?: boolean;
  profileStyle?: boolean;
  isSignIn?: boolean;
  handleInfo?: () => void;
  handleGDPR?: () => void;
};

const AppHeader = ({
  authStyle,
  expositionsStyle,
  expoStyle,
  screenStyle,
  adminStyle,
  profileStyle,
  isSignIn,
  handleInfo,
  handleGDPR,
}: AppHeaderProps) => {
  const { activeExpo, activeScreen, role } = useSelector(stateSelector);
  const admin = isAdmin(role);

  // - -

  return (
    <AppBar
      position="fixed"
      component="header"
      sx={{
        color: "white",
        backgroundColor: "#083d77",
      }}
    >
      <Toolbar>
        {authStyle ? (
          <LogoutAppHeader
            isSignIn={isSignIn}
            handleInfo={handleInfo}
            handleGDPR={handleGDPR}
          />
        ) : (
          <LoginAppHeader
            activeExpo={activeExpo}
            activeScreen={activeScreen}
            admin={admin}
            expositionsStyle={expositionsStyle}
            expoStyle={expoStyle}
            screenStyle={screenStyle}
            adminStyle={adminStyle}
            profileStyle={profileStyle}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
