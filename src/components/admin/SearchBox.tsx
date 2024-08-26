import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";

type Props = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: (e: CheckedState, value: string) => void;
};

const SearchBox = ({ onSearch, onFilter }: Props) => {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <h4>Search</h4>
        <div>
          <Input type="text" placeholder="Customer Name" onChange={onSearch} />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h4>Filter</h4>
        <div className="flex gap-4">
          <Checkbox
            id="PENDING"
            value="PENDING"
            onCheckedChange={(e) => onFilter(e, "PENDING")}
          />
          <label htmlFor="PENDING" className="text-sm">
            PENDING
          </label>
        </div>
        <div className="flex gap-4">
          <Checkbox
            id="FULFILLED"
            value="FULFILLED"
            onCheckedChange={(e) => onFilter(e, "FULFILLED")}
          />
          <label htmlFor="FULFILLED" className="text-sm">
            FULFILLED
          </label>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
