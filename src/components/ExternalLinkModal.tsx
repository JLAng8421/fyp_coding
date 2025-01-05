import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  linkUrl: string;
}

export function ExternalLinkModal({ isOpen, onClose, onConfirm, linkUrl }: ExternalLinkModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>External Link</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to visit an external website: {linkUrl}
            <br />
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
