// Components
import { PageSizeSelectField } from "./PageSizeSelectField";

import { IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

// - -

type PaginationProps = {
  page: number;
  pageSize: number;
  itemsCount: number;

  onPageSizeChange: (newValue: number) => void;
  pageSizeId: string;
  pageSizeLabel: string;

  onPageBefore: (page: number, pageSize: number) => void;
  onPageAfter: (page: number, pageSize: number) => void;
};

export const Pagination = ({
  page,
  pageSize,
  itemsCount,
  onPageSizeChange,
  pageSizeId,
  pageSizeLabel,
  onPageBefore,
  onPageAfter,
}: PaginationProps) => {
  const pgFrom = page * pageSize + 1;
  const currPgUpperBound = pgFrom + pageSize - 1;
  const pgTo = itemsCount < currPgUpperBound ? itemsCount : currPgUpperBound;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-5">
      {/* PageSizeSelectField */}
      <PageSizeSelectField
        value={pageSize}
        onChange={onPageSizeChange}
        id={pageSizeId}
        label={pageSizeLabel}
      />

      {/* Pager */}
      <div className="flex items-center gap-3">
        <div>
          {itemsCount === 0 ? "0" : `${pgFrom}-${pgTo} z ${itemsCount}`}
        </div>

        <IconButton
          disabled={page <= 0}
          onClick={() => {
            if (page > 0) {
              onPageBefore(page - 1, pageSize);
            }
          }}
        >
          <NavigateBefore sx={{ fontSize: "28px" }} />
        </IconButton>

        <IconButton
          disabled={(page + 1) * pageSize >= itemsCount}
          onClick={() => {
            onPageAfter(page + 1, pageSize);
          }}
        >
          <NavigateNext sx={{ fontSize: "28px" }} />
        </IconButton>
      </div>
    </div>
  );
};
