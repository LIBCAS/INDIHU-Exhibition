import classNames from "classnames";
import { compose, withState, withHandlers } from "recompose";
import { withRouter, NavLink } from "react-router-dom";
import { filter, get } from "lodash";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";

const TabsHeader = ({ tabs, toggleMenu, open, location }) => {
  const selected = filter(tabs, (t) => t.link === location.pathname);
  const ie = navigator.appVersion.toString().indexOf(".NET") > 0;

  const isSm = useMediaQuery(breakpoints.down("sm"));

  // Is fixed and should stay fixed (old design)
  return (
    <div
      className="tabMenu"
      style={{ position: "fixed", top: isSm ? "56px" : "64px" }}
    >
      <div className="tabMenu-tab selected" onClick={() => toggleMenu(!open)}>
        {get(selected, "[0]label", "Menu")}
      </div>
      {tabs.map((t, i) => (
        <NavLink
          key={i}
          to={t.link}
          className={classNames("tabMenu-tab", { hidden: !open })}
          activeClassName="active"
          style={{ flexBasis: `${100 / tabs.length}%` }}
          onClick={() => toggleMenu(false)}
        >
          {t.label}
        </NavLink>
      ))}
      {ie && <div className={classNames("ie", { hidden: !open })} />}
    </div>
  );
};

export default compose(
  withRouter,
  withState("open", "toggleOpen", false),
  withHandlers({
    toggleMenu:
      ({ toggleOpen }) =>
      (bool) => {
        toggleOpen(bool);
      },
  })
)(TabsHeader);
