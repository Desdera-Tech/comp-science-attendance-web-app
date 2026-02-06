import { DEVELOPER_LINK } from "@/lib/constants";
import Link from "next/link";
import { Field, FieldDescription } from "./ui/field";
import { Separator } from "./ui/separator";

export default function branding() {
  return (
    <Field className="bg-muted -mb-6 pb-6">
      <Separator className="mb-2" />
      <FieldDescription className="text-center">
        <Link href={DEVELOPER_LINK} target="_blank">
          Powered by DESDERA Technologies
        </Link>
      </FieldDescription>
    </Field>
  );
}
