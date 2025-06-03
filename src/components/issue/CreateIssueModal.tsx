import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useIntl } from "react-intl";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TCreateIssue, TRedmineError } from "../../types/redmine";
import Modal from "../general/Modal";
import Toast from "../general/Toast";
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
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onSuccess();
    },
  });

  return (
    <>
      <Modal title={formatMessage({ id: "issues.modal.add-issue.title" })} onClose={onClose}>
        <IssueForm action="create" projectId={projectId} onSubmit={(data) => createIssueMutation.mutateAsync(data)} />
      </Modal>
      {createIssueMutation.isError && (
        <Toast
          type="error"
          allowClose={false}
          message={
            isAxiosError(createIssueMutation.error)
              ? ((createIssueMutation.error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") ?? (createIssueMutation.error as AxiosError).message)
              : (createIssueMutation.error as Error).message
          }
        />
      )}
    </>
  );
};

export default CreateIssueModal;
