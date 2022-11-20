import React from "react";
import Button from "./Button";

const Navigation: React.FC<{
  page: number;
  goToPage: (page: number) => void;
}> = ({ page, goToPage }) => {
  return (
    <div className="flex justify-between">
      <Button disabled={page === 0} onClick={() => goToPage(page - 1)}>
        Prev
      </Button>
      {page}
      <Button onClick={() => goToPage(page + 1)}>Next</Button>
    </div>
  );
};

export default Navigation;
