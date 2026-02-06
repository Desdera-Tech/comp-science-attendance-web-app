import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AnalyticCard({
  title,
  value,
  className,
  titleClassName,
}: {
  title: string;
  value: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle
          className={cn(
            "font-medium text-muted-foreground text-sm",
            titleClassName,
          )}
        >
          {title}
        </CardTitle>
        <CardDescription className="flex-1 truncate text-xl text-text font-bold">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function AnalyticCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-2/3 h-6" />
      </CardHeader>
    </Card>
  );
}
