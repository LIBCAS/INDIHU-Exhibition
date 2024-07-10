import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useDebounce } from "hooks/debounce-hook";
import { useIsFirstRender } from "hooks/first-render-hook";

// Components
import AppHeader from "components/app-header/AppHeader";
import Header from "./header/Header";
import ExpoNewCard from "./ExpoNewCard";

import ExpoCard from "./ExpoCard";
import Table from "./Table";
import Footer from "containers/footer";
import { Pagination } from "components/pagination/Pagination";

// Models
import { AppState, AppDispatch } from "store/store";

// Actions and utils
import { showLoader } from "actions/app-actions";
import { getExpositionsParametrized } from "actions/expoActions";
import { getCurrentUser } from "actions/user-actions";
import { debounce } from "lodash";
import { setExpositionsScrollTop } from "actions/app-actions";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.expositions,
  (expositions) => ({ expositions })
);

// - -

type ExpositionFilter = "ALL" | "AUTHORSHIP" | "READ_ONLY" | "READ_WRITE";

type ExpositionSort = "title" | "state" | "created" | "edited" | "isEditing";

type ExpositionOrder = "ASC" | "DESC";

export type ExpositionsFilterStateObj = {
  filter: ExpositionFilter;
  sort: ExpositionSort;
  order: ExpositionOrder;
  search: string;
  page: number;
  pageSize: number;
  isCardList: boolean;
  showOnlyPinned: boolean;
};

export type ExpositionsFilterStateSetter = <
  K extends keyof ExpositionsFilterStateObj
>(
  userStateKey: K,
  newValue: ExpositionsFilterStateObj[K]
) => void;

// - -

const CONTAINER_ID = "expositions-scroll-container";

const Expositions = () => {
  const { expositions } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("exhibitions-page");

  const isFirstRender = useIsFirstRender();

  // - -

  const [expositionsFilterState, setExpositionsFilterState] =
    useState<ExpositionsFilterStateObj>({
      filter: "ALL",
      sort: "edited",
      order: "ASC",
      search: "",
      page: 0,
      pageSize: 10,
      isCardList: true,
      showOnlyPinned: false,
    });

  const debouncedSearchFilter = useDebounce(expositionsFilterState.search, 400);

  // - -

  useEffect(() => {
    const handleChange = async () => {
      dispatch(showLoader(true));
      if (isFirstRender) {
        await dispatch(getCurrentUser(true));
      }
      await dispatch(getExpositionsParametrized(expositionsFilterState));
      dispatch(showLoader(false));
    };

    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    expositionsFilterState.filter,
    expositionsFilterState.sort,
    expositionsFilterState.order,
    debouncedSearchFilter,
    expositionsFilterState.page,
    expositionsFilterState.pageSize,
    expositionsFilterState.isCardList,
    expositionsFilterState.showOnlyPinned,
  ]);

  // - -

  const handleScroll = () => {
    debounce(() => {
      const container = document.getElementById(CONTAINER_ID);
      if (container) {
        dispatch(setExpositionsScrollTop(container.scrollTop));
      }
    }, 300);
  };

  // - -

  const filteredExpositions = useMemo(
    () =>
      expositions.items?.filter((expositionItem) =>
        expositionsFilterState.showOnlyPinned ? expositionItem.pinned : true
      ),
    [expositions?.items, expositionsFilterState.showOnlyPinned]
  );

  return (
    <div className="expositions-container-outter">
      <AppHeader expositionsStyle />

      <div
        id={CONTAINER_ID}
        className="expositions-container"
        onScroll={handleScroll}
      >
        <div className="expositions-container-inner h-full flex flex-col">
          <Header
            expositionsFilterState={expositionsFilterState}
            setExpositionsFilterState={setExpositionsFilterState}
          />

          {expositionsFilterState.isCardList && (
            <div className="h-full flex flex-col">
              <div className="flex justify-center flex-wrap gap-[10px]">
                <ExpoNewCard />

                {filteredExpositions?.map((expositionItem) => {
                  return (
                    <ExpoCard
                      key={expositionItem.id}
                      expositionItem={expositionItem}
                      expositionsFilterState={expositionsFilterState}
                    />
                  );
                })}
              </div>

              <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
                <Pagination
                  page={expositionsFilterState.page}
                  pageSize={expositionsFilterState.pageSize}
                  itemsCount={
                    expositionsFilterState.showOnlyPinned
                      ? filteredExpositions?.length ?? 0
                      : expositions.count
                  }
                  onPageSizeChange={(newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: 0,
                      pageSize: newPageSize,
                    }));
                  }}
                  pageSizeId="expositions-page-size"
                  pageSizeLabel={t("pager.entriesPerPage")}
                  onPageBefore={(newPage: number, _newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: newPage,
                    }));
                  }}
                  onPageAfter={(newPage: number, _newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: newPage,
                    }));
                  }}
                />
              </div>
            </div>
          )}

          {!expositionsFilterState.isCardList && (
            <div className="h-full flex flex-col">
              <Table
                expositions={expositions.items}
                expositionsFilterState={expositionsFilterState}
                setExpositionsFilterState={setExpositionsFilterState}
              />

              <div className="mt-2 p-4 w-full flex justify-center md:justify-end items-center">
                <Pagination
                  page={expositionsFilterState.page}
                  pageSize={expositionsFilterState.pageSize}
                  itemsCount={
                    expositionsFilterState.showOnlyPinned
                      ? filteredExpositions?.length ?? 0
                      : expositions.count
                  }
                  onPageSizeChange={(newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: 0,
                      pageSize: newPageSize,
                    }));
                  }}
                  pageSizeId="expositions-page-size"
                  pageSizeLabel={t("pager.entriesPerPage")}
                  onPageBefore={(newPage: number, _newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: newPage,
                    }));
                  }}
                  onPageAfter={(newPage: number, _newPageSize: number) => {
                    setExpositionsFilterState((prev) => ({
                      ...prev,
                      page: newPage,
                    }));
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
