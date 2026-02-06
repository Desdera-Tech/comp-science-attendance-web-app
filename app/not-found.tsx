"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconError404 } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-1 items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-24" variant="default">
            <IconError404 className="size-24" />
          </EmptyMedia>
          <EmptyTitle className="font-semibold text-2xl">
            Page not found
          </EmptyTitle>
          <EmptyDescription>
            The requested page does not exist or could not be found on our
            server. Please return to the previous page.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          variant="link"
          className="text-muted-foreground"
          size="sm"
          onClick={onBack}
        >
          Back <ArrowUpRightIcon />
        </Button>
      </Empty>
    </div>
  );
}
