import { useRedmineIssue } from "@/api/redmine/hooks/useRedmineIssue";
import { redmineIssuesQueries } from "@/api/redmine/queries/issues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { TIssue, TUpdateIssue } from "../../api/redmine/types";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { IssueForm } from "./form/IssueForm";
import { IssueTitle } from "./IssueTitle";

type PropTypes = {
  issue: TIssue;
  onClose: () => void;
  onSuccess: () => void;
};

const EditIssueModal = ({ issue: currentIssue, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const issueQuery = useRedmineIssue(currentIssue.id, {
    staleTime: 0,
  });
  const issue = issueQuery.data ?? currentIssue;

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(redmineIssuesQueries);
      onSuccess();
    },
    meta: {
      successMessage: formatMessage({ id: "issues.modal.edit-issue.success" }),
    },
  });

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formatMessage({ id: "issues.modal.edit-issue.title" })}</DialogTitle>
          </DialogHeader>
          <IssueTitle issue={issue} />
          <IssueForm action="edit" issue={issue} onSubmit={(data) => updateIssueMutation.mutateAsync(data)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditIssueModal;
