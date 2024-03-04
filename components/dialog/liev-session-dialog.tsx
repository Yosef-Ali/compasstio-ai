import { useDialog } from "@/app/hooks/useDialog";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/loading-button";
import MultipleSelectorWithCreateGroup from "../live-session-group-forms/create-form";
import MultipleSelectorWithDeleteGroup from "../live-session-group-forms/delete-form";
import MultipleSelectorWithEditGroup from "../live-session-group-forms/edit-form";

export function LiveSessionsDialog({ ...props }) {
  const { dialog } = props
  const [loading, setIsLoading] = useState(false);
  const { isOpen, onClose } = useDialog()
  const formRef = useRef<any>();

  // eslint-disable-next-line react/display-name
  const CreateDialog = () => {
    return (
      <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={false} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new group</DialogTitle>
            <DialogDescription>
              Add a new group to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <MultipleSelectorWithCreateGroup ref={formRef} setLoading={setIsLoading} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <LoadingButton loading={loading} type="submit" onClick={() => formRef.current.submitForm()}>
              Save Changes
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  CreateDialog.displayName = 'LiveSessionsCreateDialog';
  const EditDialog = () => {
    return (
      <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={false} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit group</DialogTitle>
            <DialogDescription>
              Edit an existing group from participants.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <MultipleSelectorWithEditGroup ref={formRef} setLoading={setIsLoading} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <LoadingButton loading={loading} type="submit" onClick={() => formRef.current.submitForm()}>
              Save Changes
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  EditDialog.displayName = 'LiveSessionsEditDialog';
  const DeleteDialog = () => {
    return (
      <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={false} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete group</DialogTitle>
            <DialogDescription>
              Delete an existing group from participants.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <MultipleSelectorWithDeleteGroup ref={formRef} setLoading={setIsLoading} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  DeleteDialog.displayName = 'LiveSessionsDeleteDialog';

  return (
    <>
      {dialog === "createGroup" && <CreateDialog />}
      {dialog === "editGroup" && <EditDialog />}
      {dialog === "deleteGroup" && <DeleteDialog />}
    </>
  )
}
