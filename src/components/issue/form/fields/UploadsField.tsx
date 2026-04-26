import { TUploadAttachment } from "@/api/redmine/types";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/useAppForm";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useMutation } from "@tanstack/react-query";
import { PaperclipIcon, Trash2Icon } from "lucide-react";
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
      <div className="flex flex-col gap-0.5">
        {state.value?.map((upload, index) => (
          <div key={upload.token} className="flex items-center gap-2">
            <PaperclipIcon className="text-muted-foreground size-4 shrink-0" />
            <span className="flex-1 truncate">{upload.filename}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={async () => {
                const { uploadId } = upload.token.match(/^(?<uploadId>\d+)\..*$/)?.groups || {};
                if (uploadId) {
                  await removeAttachmentMutation.mutateAsync(Number(uploadId));
                }
                removeValue(index);
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
    </Field>
  );
};

export default UploadsField;
