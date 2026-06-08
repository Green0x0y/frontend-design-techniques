import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

export { BreadcrumbLink };
