import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { AlertType } from "@/types";
import { Loader } from "lucide-react";

const Alert = ({
  open,
  title,
  discription,
  cancleHandler,
  confirmHandler,
  inProgress,
  children,
}: AlertType) => {
  return (
    <div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> {title}</AlertDialogTitle>
            <AlertDialogDescription>{discription}</AlertDialogDescription>
          </AlertDialogHeader>
          <div>{children}</div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancleHandler}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmHandler} disabled={inProgress}>
              {inProgress ? <Loader className="animate-spin" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Alert;
