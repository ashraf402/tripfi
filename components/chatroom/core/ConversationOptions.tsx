"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameDialog } from "@/components/ui/rename-dialog";
import { cn } from "@/lib/utils";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface ConversationOptionsProps {
  conversationId: string;
  currentTitle: string;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isInSidebar?: boolean;
}

export function ConversationOptions({
  conversationId,
  currentTitle,
  onRename,
  onDelete,
  isInSidebar,
}: ConversationOptionsProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameInitialValue, setRenameInitialValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleRenameOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRenameInitialValue(currentTitle);
    setRenameOpen(true);
  };

  const handleRenameSubmit = async (trimmedName: string) => {
    await onRename(conversationId, trimmedName);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(conversationId);
    } catch (e) {
      console.error("Failed to delete:", e);
      setIsDeleting(false);
    }
  };

  const openDeleteConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  return (
    <>
      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        initialValue={renameInitialValue}
        onRename={handleRenameSubmit}
        title="Rename conversation"
        description="Enter a new name for this conversation."
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-text-secondary hover:text-foreground",
              isInSidebar ? "size-6" : "size-8 md:size-9",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreVertical className={cn(isInSidebar ? "size-4" : "size-5")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-surface border-border">
          <DropdownMenuItem
            onClick={handleRenameOpen}
            className="text-foreground focus:bg-surface-hover cursor-pointer gap-2"
          >
            <Pencil className="w-4 h-4" />
            Rename conversation
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={openDeleteConfirm}
            className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        trigger={<span />}
        title="Delete conversation?"
        description="This will permanently delete this conversation and all its messages. This cannot be undone."
        confirmLabel="Delete"
        loadingLabel="Deleting…"
        variant="destructive"
        isLoading={isDeleting}
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
