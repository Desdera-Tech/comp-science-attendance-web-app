import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orderFilterData } from "@/lib/data";
import { Order } from "@/types";
import { IconFilter2 } from "@tabler/icons-react";
import { LucideCheck } from "lucide-react";

export default function FilterDropdown({
  order,
  setOrder,
}: {
  order: Order;
  setOrder: (order: Order) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-10">
          <IconFilter2 className="text-text size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter</DropdownMenuLabel>
          {orderFilterData.map(({ Icon, label, value }) => (
            <DropdownMenuItem
              key={value}
              className="flex items-center justify-between"
              onClick={() => setOrder(value)}
            >
              <div className="flex items-center gap-2">
                <Icon /> {label}
              </div>
              {order === value && <LucideCheck className="size-4 opacity-70" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
