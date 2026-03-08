import { redmineIssuesQueries } from "@/api/redmine/queries/issues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { TCreateIssue } from "../../api/redmine/types";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { IssueForm } from "./form/IssueForm";

type PropTypes = {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateIssueModal = ({ projectId, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const createIssueMutation = useMutation({
    mutationFn: (issue: TCreateIssue) => redmineApi.createIssue(issue),
    onSuccess: () => {
      queryClient.invalidateQueries(redmineIssuesQueries);
      onSuccess();
    },
    meta: {
      successMessage: formatMessage({ id: "issues.modal.add-issue.success" }),
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formatMessage({ id: "issues.modal.add-issue.title" })}</DialogTitle>
        </DialogHeader>
        <IssueForm action="create" projectId={projectId} onSubmit={(data) => createIssueMutation.mutateAsync(data)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueModal;
