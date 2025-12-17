import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import classes from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  jumpToPage: (page: number) => void;
  pageNumbers: number[];
}

export function Pagination({
  currentPage,
  jumpToPage,
  pageNumbers,
}: PaginationProps) {
  if (pageNumbers.length === 0) return <></>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <ul className="list-group list-group-horizontal shadow-lg">
        <button
          onClick={() => jumpToPage(currentPage - 1)}
          className="background-1 border-0 rounded-start"
        >
          <ArrowBigLeft fill="#67c090" className="color-3" />
        </button>

        {pageNumbers.map((number) => (
          <li
            key={number}
            id={String(number)}
            className={`list-group-item border-0 ${classes.pagination_li} ${
              number === currentPage ? "background-2" : "background-3"
            }`}
            onClick={() => jumpToPage(number)}
          >
            {number + 1}
          </li>
        ))}

        <button
          onClick={() => jumpToPage(currentPage + 1)}
          className="background-1 border-0 rounded-end"
        >
          <ArrowBigRight fill="#67c090" className="color-3" />
        </button>
      </ul>
    </div>
  );
}
