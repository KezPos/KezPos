import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { btn } from "./ui";

export function Button({ className, variant = "ghost", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btn }) {
  return <button type="button" className={cn(btn[variant], className)} {...props} />;
}