import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useIntl } from "react-intl";
import useIssue from "../../hooks/useIssue";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TIssue, TRedmineError, TUpdateIssue } from "../../types/redmine";
import Modal from "../general/Modal";
import Toast from "../general/Toast";
import { IssueForm } from "./form/IssueForm";

type PropTypes = {
  issue: TIssue;
  onClose: () => void;
  onSuccess: () => void;
};

const EditIssueModal = ({ issue: currentIssue, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const issueQuery = useIssue(currentIssue.id, { staleTime: 0 });

  const issue = issueQuery.data ?? currentIssue;

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onSuccess();
    },
  });

  return (
    <>
      <Modal title={formatMessage({ id: "issues.modal.edit-issue.title" })} onClose={onClose}>
        <IssueForm action="edit" issue={issue} onSubmit={(data) => updateIssueMutation.mutateAsync(data)} />
      </Modal>
      {updateIssueMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(updateIssueMutation.error)
              ? ((updateIssueMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (updateIssueMutation.error as AxiosError).message)
              : (updateIssueMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default EditIssueModal;
