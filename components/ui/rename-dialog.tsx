"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface RenameDialogProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Initial value to populate the input with */
  initialValue?: string;
  /** Callback when the user confirms the rename. Can be async. */
  onRename: (newName: string) => void | Promise<void>;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
}

export function RenameDialog({
  open,
  onOpenChange,
  initialValue = "",
  onRename,
  title = "Rename",
  description = "Enter a new name.",
}: RenameDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update internal value when dialog opens with a new initialValue
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await onRename(trimmed);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-secondary">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="New name…"
          className="bg-background border-border text-foreground"
          autoFocus
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-secondary hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !value.trim()}
            className="bg-primary text-black hover:bg-primary-hover"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
