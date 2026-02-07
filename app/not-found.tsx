import { NotFoundComp } from "@/components/not-found";

export default function NotFound() {
  return (
    <NotFoundComp
      title="Page not found"
      description="The requested page does not exist or could not be found on our server. Please return to the previous page."
    />
  );
}
