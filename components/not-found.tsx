"use client";

import { IconError404 } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export function NotFoundComp({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-1 items-center">
      <Empty>
        <EmptyHeader className={className}>
          <EmptyMedia className="size-24" variant="default">
            <IconError404 className="size-24" />
          </EmptyMedia>
          <EmptyTitle className="font-semibold text-2xl">{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
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
