interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

function createVisiblePages(options: {
  currentPage: number;
  totalPages: number;
}): number[] {
  const pages: number[] = [];
  const startPage = Math.max(1, options.currentPage - 2);
  const endPage = Math.min(options.totalPages, options.currentPage + 2);

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  return pages;
}

export function PaginationControls(props: PaginationControlsProps) {
  if (props.totalPages <= 1) {
    return null;
  }

  const visiblePages = createVisiblePages({
    currentPage: props.currentPage,
    totalPages: props.totalPages,
  });
  const isPreviousDisabled = props.disabled || props.currentPage <= 1;
  const isNextDisabled = props.disabled || props.currentPage >= props.totalPages;

  return (
    <nav
      aria-label="Favorites pagination"
      className="mt-4 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPreviousDisabled}
        onClick={() => props.onPageChange(props.currentPage - 1)}
      >
        Previous
      </button>

      {visiblePages.map((pageNumber) => {
        const isCurrentPage = pageNumber === props.currentPage;

        return (
          <button
            key={pageNumber}
            type="button"
            className={
              isCurrentPage
                ? 'rounded-full border border-primary bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground'
                : 'rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted'
            }
            disabled={props.disabled || isCurrentPage}
            aria-current={isCurrentPage ? 'page' : undefined}
            onClick={() => props.onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isNextDisabled}
        onClick={() => props.onPageChange(props.currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}
