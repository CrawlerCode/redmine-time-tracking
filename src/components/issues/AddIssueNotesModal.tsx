import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { FastField, Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import useSettings from "../../hooks/useSettings";
import { useRedmineApi } from "../../provider/RedmineApiProvider";
import { TIssue, TRedmineError, TUpdateIssue } from "../../types/redmine";
import Button from "../general/Button";
import LoadingSpinner from "../general/LoadingSpinner";
import Modal from "../general/Modal";
import TextareaField from "../general/TextareaField";
import Toast from "../general/Toast";
import Toggle from "../general/Toggle";

type PropTypes = {
  issue: TIssue;
  onClose: () => void;
  onSuccess: () => void;
};

const AddIssueNotesModal = ({ issue, onClose, onSuccess }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();
  const queryClient = useQueryClient();

  const formik = useRef<FormikProps<TUpdateIssue>>(null);

  const updateIssueMutation = useMutation({
    mutationFn: (data: TUpdateIssue) => redmineApi.updateIssue(issue.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onSuccess();
    },
  });

  return (
    <>
      <Modal title={formatMessage({ id: "issues.modal.add-issue-notes.title" })} onClose={onClose}>
        <Formik<TUpdateIssue>
          innerRef={formik}
          initialValues={{
            notes: "",
            private_notes: false,
          }}
          validationSchema={Yup.object({
            notes: Yup.string().required(formatMessage({ id: "issues.issue.field.notes.validation.required" })),
            private_notes: Yup.boolean(),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            await updateIssueMutation.mutateAsync(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, touched, errors }) => {
            return (
              <Form>
                <div className="flex flex-col gap-y-2">
                  <h1 className="mb-1 truncate">
                    <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline">
                      {issue.tracker.name} #{issue.id}
                    </a>{" "}
                    {issue.subject}
                  </h1>

                  <FastField
                    type="textarea"
                    name="notes"
                    placeholder={formatMessage({ id: "issues.issue.field.notes" })}
                    as={TextareaField}
                    size="sm"
                    error={touched.notes && errors.notes}
                    autoFocus
                  />

                  <FastField type="checkbox" name="private_notes" title={formatMessage({ id: "issues.issue.field.private-notes" })} as={Toggle} error={touched.private_notes && errors.private_notes} />

                  <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-x-2">
                    <FormattedMessage id="issues.modal.add-issue-notes.submit" />
                    {isSubmitting && <LoadingSpinner />}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
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
