import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import * as React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-lg border bg-card text-foreground shadow-lg " +
            "border-border data-[type=success]:border-primary/50 " +
            "data-[type=success]:shadow-primary/20 " +
            "data-[type=error]:border-destructive/60 " +
            "data-[type=error]:shadow-destructive/30",

          description:
            "text-muted-foreground",

          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",

          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/80",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
