/* eslint-disable react/no-children-prop */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useIntl } from "react-intl";
import { z } from "zod/v4";
import { useAppForm } from "../../hooks/useAppForm";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TIssue, TRedmineError, TUpdateIssue } from "../../types/redmine";
import Modal from "../general/Modal";
import Toast from "../general/Toast";
import IssueTitle from "./IssueTitle";

const addIssueNotesFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    notes: z.string(formatMessage({ id: "issues.issue.field.notes.validation.required" })).nonempty(formatMessage({ id: "issues.issue.field.notes.validation.required" })),
    private_notes: z.boolean().optional(),
  });

type TAddIssueNotesForm = z.infer<ReturnType<typeof addIssueNotesFormSchema>>;

type PropTypes = {
  issue: TIssue;
  onClose: () => void;
  onSuccess: () => void;
};

const AddIssueNotesModal = ({ issue, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();

  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      notes: "",
      private_notes: false,
    } satisfies TAddIssueNotesForm as TAddIssueNotesForm,
    validators: {
      onChange: addIssueNotesFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => updateIssueMutation.mutateAsync(value),
  });

  return (
    <>
      <Modal title={formatMessage({ id: "issues.modal.add-issue-notes.title" })} onClose={onClose}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-y-2">
            <IssueTitle issue={issue} />

            <form.AppField
              name="notes"
              children={(field) => (
                <field.TextareaField title={formatMessage({ id: "issues.issue.field.notes" })} placeholder={formatMessage({ id: "issues.issue.field.notes" })} required size="sm" autoFocus />
              )}
            />

            <form.AppField name="private_notes" children={(field) => <field.ToggleField title={formatMessage({ id: "issues.issue.field.private-notes" })} />} />

            <form.AppForm>
              <form.SubmitButton children={formatMessage({ id: "issues.modal.add-issue-notes.submit" })} />
            </form.AppForm>
          </div>
        </form>
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

export default AddIssueNotesModal;
