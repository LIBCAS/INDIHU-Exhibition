import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { AppState } from "store/store";
import LoaderScreen from "./loader-screen";

const stateSelector = createSelector(
  ({ app }: AppState) => app.loader,
  (loader) => ({ loader })
);

const Loader = () => {
  const { loader } = useSelector(stateSelector);
  if (!loader) {
    return null;
  }

  return <LoaderScreen />;
};

export default Loader;
