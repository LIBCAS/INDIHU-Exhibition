import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useIsFirstRender } from "hooks/first-render-hook";
import { useDebounce } from "hooks/debounce-hook";

// Components
import AppHeader from "components/app-header/AppHeader";
import Header from "./Header";
import ExpoNewCard from "./ExpoNewCard";

import ExpoCard from "./ExpoCard";
import Table from "./Table";
import Footer from "containers/footer";

// Models
import { AppState, AppDispatch } from "store/store";

// Actions and utils
import { showLoader, setExpositionsScrollTop } from "actions/app-actions";
import { getExpositionsParametrized, setExpoPager } from "actions/expoActions";
import { getCurrentUser } from "actions/user-actions";
import { debounce } from "lodash";
import { Pagination } from "components/pagination/Pagination";

// - -

const stateSelector = createSelector(
  ({ app }: AppState) => app.expositionsScrollTop,
  ({ expo }: AppState) => expo.expositions,
  ({ expo }: AppState) => expo.cardsList,
  ({ expo }: AppState) => expo.filter,
  ({ expo }: AppState) => expo.pager,
  (expositionsScrollTop, expositions, cardsList, filter, pager) => ({
    expositionsScrollTop,
    expositions,
    cardsList,
    filter,
    pager,
  })
);

// - -

const CONTAINER_ID = "expositions-scroll-container";

const Expositions = () => {
  const { expositions, cardsList, filter, pager } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const isFirstRender = useIsFirstRender();

  const { t } = useTranslation("exhibitions-page");

  // Extract from filter obj (in useEffect, they are act as string change)
  const filterFilter = useMemo(() => filter.filter, [filter.filter]);
  const filterSort = useMemo(() => filter.sort, [filter.sort]);
  const filterOrder = useMemo(() => filter.order, [filter.order]);
  const filterSearch = useMemo(() => filter.search, [filter.search]);

  const debouncedFilterSearch = useDebounce(filterSearch, 400);

  // - -

  useEffect(() => {
    const handleMount = async () => {
      dispatch(showLoader(true));
      await dispatch(getCurrentUser(true));
      await dispatch(getExpositionsParametrized());
      dispatch(showLoader(false));
    };
    handleMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // - -

  useEffect(() => {
    const handleChange = async () => {
      if (isFirstRender) {
        return;
      }
      dispatch(showLoader(true));
      await dispatch(getExpositionsParametrized());
      dispatch(showLoader(false));
    };
    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsList, pager, filterSort, filterOrder]);

  // This effect will trigger the previous effect
  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    dispatch(setExpoPager(0, pager.pageSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterSearch, filterFilter]);

  // - -

  const handleScroll = () => {
    debounce(() => {
      const container = document.getElementById(CONTAINER_ID);
      if (container) {
        dispatch(setExpositionsScrollTop(container.scrollTop));
      }
    }, 300);
  };

  return (
    <div className="expositions-container-outter">
      <AppHeader expositionsStyle />

      <div
        id={CONTAINER_ID}
        className="expositions-container !mt-0"
        onScroll={handleScroll}
      >
        <div className="expositions-container-inner h-full flex flex-col">
          <Header cardsList={cardsList} pager={pager} />

          {cardsList && (
            <div className="h-full flex flex-col">
              <div className="flex justify-center flex-wrap gap-[10px]">
                <ExpoNewCard />

                {expositions?.items?.map((expositionItem) => {
                  return (
                    <ExpoCard
                      key={expositionItem.id}
                      expositionItem={expositionItem}
                    />
                  );
                })}
              </div>

              <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
                <Pagination
                  page={pager.page}
                  pageSize={pager.pageSize}
                  itemsCount={expositions.count}
                  onPageSizeChange={(newPageSize: number) => {
                    dispatch(setExpoPager(pager.page, newPageSize));
                  }}
                  pageSizeId="expositions-page-size"
                  pageSizeLabel={t("pager.entriesPerPage")}
                  onPageBefore={(newPage: number, newPageSize: number) => {
                    dispatch(setExpoPager(newPage, newPageSize));
                  }}
                  onPageAfter={(newPage: number, newPageSize: number) => {
                    dispatch(setExpoPager(newPage, newPageSize));
                  }}
                />
              </div>
            </div>
          )}

          {!cardsList && (
            <div className="h-full flex flex-col">
              <Table expositions={expositions.items} filter={filter} />

              <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
                <Pagination
                  page={pager.page}
                  pageSize={pager.pageSize}
                  itemsCount={expositions.count}
                  onPageSizeChange={(newPageSize: number) => {
                    dispatch(setExpoPager(pager.page, newPageSize));
                  }}
                  pageSizeId="expositions-page-size"
                  pageSizeLabel={t("pager.entriesPerPage")}
                  onPageBefore={(newPage: number, newPageSize: number) => {
                    dispatch(setExpoPager(newPage, newPageSize));
                  }}
                  onPageAfter={(newPage: number, newPageSize: number) => {
                    dispatch(setExpoPager(newPage, newPageSize));
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Expositions;
