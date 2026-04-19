/* eslint-disable react/no-children-prop */
import { redmineIssuesQueries } from "@/api/redmine/queries/issues";
import UploadsField from "@/components/issue/form/fields/UploadsField";
import { useSettings } from "@/provider/SettingsProvider";
import { markdownToTextile } from "@/utils/markdownToTextile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { z } from "zod";
import { TIssue, TUpdateIssue } from "../../api/redmine/types";
import { useAppForm } from "../../hooks/useAppForm";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormGrid } from "../ui/form";
import { IssueTitle } from "./IssueTitle";

const addIssueNotesFormSchema = ({ formatMessage }: { formatMessage: ReturnType<typeof useIntl>["formatMessage"] }) =>
  z.object({
    notes: z.string(formatMessage({ id: "issues.issue.field.notes.validation.required" })).nonempty(formatMessage({ id: "issues.issue.field.notes.validation.required" })),
    private_notes: z.boolean().optional(),
    uploads: z.array(z.object({ token: z.string(), filename: z.string(), content_type: z.string().optional(), description: z.string().optional() })),
  });

type TAddIssueNotesForm = z.infer<ReturnType<typeof addIssueNotesFormSchema>>;

type PropTypes = {
  issue: TIssue;
  onClose: () => void;
  onSuccess: () => void;
};

const AddIssueNotesModal = ({ issue, onClose, onSuccess }: PropTypes) => {
  const { settings } = useSettings();
  const { formatMessage } = useIntl();

  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) =>
      redmineApi.updateIssue(issue.id, {
        ...data,
        ...(data.notes &&
          settings.redmine.settings.textFormatting === "textile" && {
            notes: markdownToTextile(data.notes),
          }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(redmineIssuesQueries);
      onSuccess();
    },
    meta: {
      successMessage: formatMessage({ id: "issues.modal.add-issue-notes.success" }),
    },
  });
  const uploadAttachmentMutation = useMutation({
    mutationFn: (file: File) => redmineApi.uploadAttachment(file),
  });

  const form = useAppForm({
    defaultValues: {
      notes: "",
      private_notes: false,
      uploads: [],
    } satisfies TAddIssueNotesForm as TAddIssueNotesForm,
    validators: {
      onChange: addIssueNotesFormSchema({ formatMessage }),
    },
    onSubmit: async ({ value }) => updateIssueMutation.mutateAsync(value),
  });

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <Form onSubmit={form.handleSubmit} className="contents">
            <DialogHeader>
              <DialogTitle>{formatMessage({ id: "issues.modal.add-issue-notes.title" })}</DialogTitle>
            </DialogHeader>
            <IssueTitle issue={issue} />
            <FormGrid>
              <form.AppField
                name="notes"
                children={(field) => (
                  <field.RedmineMdEditorField
                    title={formatMessage({ id: "issues.issue.field.notes" })}
                    textareaProps={{ placeholder: formatMessage({ id: "issues.issue.field.notes" }) }}
                    required
                    autoFocus
                    hideToolbar={settings.redmine.settings.textFormatting === "none"}
                    onUploadImage={async (file) => {
                      const { id: _, url, ...attachment } = await uploadAttachmentMutation.mutateAsync(file);
                      form.pushFieldValue("uploads", attachment);
                      if (settings.redmine.settings.textFormatting !== "none") {
                        return { url, alt: attachment.filename };
                      }
                    }}
                  />
                )}
              />
              <form.AppField name="uploads" children={() => <UploadsField />} />

              <form.AppField name="private_notes" children={(field) => <field.SwitchField title={formatMessage({ id: "issues.issue.field.private-notes" })} />} />
            </FormGrid>
            <DialogFooter>
              <form.AppForm>
                <form.SubmitButton children={formatMessage({ id: "issues.modal.add-issue-notes.submit" })} />
              </form.AppForm>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddIssueNotesModal;
