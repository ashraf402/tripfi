"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React from "react";

interface ConfirmDialogProps {
  /** The element that triggers the dialog (e.g. a button) */
  trigger: React.ReactNode;
  /** Dialog title */
  title: string;
  /** Dialog description / body text */
  description: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label shown while the action is in progress */
  loadingLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Visual variant for the confirm button */
  variant?: "destructive" | "default";
  /** Whether the action is currently in progress */
  isLoading?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when the user confirms the action */
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  loadingLabel = "Loading...",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const confirmClasses =
    variant === "destructive"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-primary hover:bg-primary-hover text-black";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-100 bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-secondary">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-secondary hover:text-foreground"
            >
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={confirmClasses}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
