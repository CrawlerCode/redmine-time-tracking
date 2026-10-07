import { TUploadAttachment } from "@/api/redmine/types";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Field, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/useAppForm";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useMutation } from "@tanstack/react-query";
import { FileIcon, XIcon } from "lucide-react";
import { useIntl } from "react-intl";

const UploadsField = () => {
  const { formatMessage } = useIntl();

  const { state, removeValue } = useFieldContext<TUploadAttachment[]>();

  const redmineApi = useRedmineApi();
  const removeAttachmentMutation = useMutation({
    mutationFn: (id: number) => redmineApi.removeAttachment(id),
  });

  if (!state.value || state.value.length === 0) return null;

  return (
    <Field>
      <FieldLabel>{formatMessage({ id: "issues.issue.field.uploads" })}</FieldLabel>
      <div className="flex flex-col gap-1">
        {state.value?.map((upload, index) => (
          <Attachment key={upload.token} size="xs" className="w-full">
            <AttachmentMedia>
              <FileIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{upload.filename}</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                onClick={async () => {
                  const { uploadId } = upload.token.match(/^(?<uploadId>\d+)\..*$/)?.groups || {};
                  if (uploadId) {
                    await removeAttachmentMutation.mutateAsync(Number(uploadId));
                  }
                  removeValue(index);
                }}
              >
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
    </Field>
  );
};

export default UploadsField;
