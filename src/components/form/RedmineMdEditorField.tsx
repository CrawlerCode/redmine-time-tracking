import { TAttachment, TUploadAttachment } from "@/api/redmine/types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/useAppForm";
import { useSettings } from "@/provider/SettingsProvider";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  BoldIcon,
  ChevronsLeftRightEllipsisIcon,
  CodeXmlIcon,
  EyeIcon,
  Grid2x2PlusIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HeadingIcon,
  ImageIcon,
  ItalicIcon,
  ListIcon,
  ListIndentIncreaseIcon,
  ListOrderedIcon,
  ListTodoIcon,
  PencilIcon,
  StrikethroughIcon,
  TypeIcon,
  UnderlineIcon,
} from "lucide-react";
import { ComponentProps, useId, useState } from "react";
import { useIntl } from "react-intl";

type RedmineTextEditorFieldProps = Omit<ComponentProps<typeof MDEditor>, "id" | "value" | "onChange" | "onBlur"> & {
  required?: boolean;
  attachments?: TAttachment[];
  uploads?: TUploadAttachment[];
  onUploadImage?: (file: File) => Promise<{ url: string; alt?: string } | void>;
};

export const RedmineMdEditorField = ({ title, required, className, attachments, uploads, onUploadImage, ...props }: RedmineTextEditorFieldProps) => {
  const { state, handleChange, handleBlur } = useFieldContext<string | null>();
  const isInvalid = !state.meta.isValid && state.meta.isTouched;
  const id = useId();

  const { settings } = useSettings();
  const { formatMessage } = useIntl();

  const [preview, setPreview] = useState<"edit" | "preview">("edit");

  return (
    <Field data-invalid={isInvalid} className={className}>
      {title && (
        <FieldLabel required={required} htmlFor={id} className="truncate">
          {title}
        </FieldLabel>
      )}
      <MDEditor
        id={id}
        aria-invalid={isInvalid}
        commands={[
          commands.group(
            [
              {
                ...commands.bold,
                buttonProps: { "aria-label": "Bold", title: formatMessage({ id: "editor.command.bold" }) },
                icon: <BoldIcon className="size-4" />,
              },
              {
                ...commands.italic,
                buttonProps: { "aria-label": "Italic", title: formatMessage({ id: "editor.command.italic" }) },
                icon: <ItalicIcon className="size-4" />,
              },
              {
                name: "underline",
                keyCommand: "underline",
                shortcuts: "ctrlcmd+u",
                prefix: "<u>",
                suffix: "</u>",
                buttonProps: { "aria-label": "Underline", title: formatMessage({ id: "editor.command.underline" }) },
                icon: <UnderlineIcon className="size-4" />,
                execute: commands.bold.execute,
              },
              {
                ...commands.strikethrough,
                buttonProps: { "aria-label": "Strikethrough", title: formatMessage({ id: "editor.command.strikethrough" }) },
                icon: <StrikethroughIcon className="size-4" />,
              },
            ],
            {
              name: "format",
              groupName: "format",
              buttonProps: { "aria-label": "Format" },
              icon: <TypeIcon className="size-4" />,
            }
          ),
          commands.group(
            [
              {
                ...commands.heading1,
                buttonProps: { "aria-label": "Heading 1", title: formatMessage({ id: "editor.command.heading1" }) },
                icon: <Heading1Icon className="size-4" />,
              },
              {
                ...commands.heading2,
                buttonProps: { "aria-label": "Heading 2", title: formatMessage({ id: "editor.command.heading2" }) },
                icon: <Heading2Icon className="size-4" />,
              },
              {
                ...commands.heading3,
                buttonProps: { "aria-label": "Heading 3", title: formatMessage({ id: "editor.command.heading3" }) },
                icon: <Heading3Icon className="size-4" />,
              },
            ],
            {
              name: "heading",
              groupName: "heading",
              buttonProps: { "aria-label": "Heading" },
              icon: <HeadingIcon className="size-4" />,
            }
          ),
          commands.group(
            [
              {
                ...commands.unorderedListCommand,
                buttonProps: { "aria-label": "Unordered List", title: formatMessage({ id: "editor.command.unordered-list" }) },
                icon: <ListIcon className="size-4" />,
              },
              {
                ...commands.orderedListCommand,
                buttonProps: { "aria-label": "Ordered List", title: formatMessage({ id: "editor.command.ordered-list" }) },
                icon: <ListOrderedIcon className="size-4" />,
              },
              {
                ...commands.checkedListCommand,
                buttonProps: { "aria-label": "Checked List", title: formatMessage({ id: "editor.command.checked-list" }) },
                icon: <ListTodoIcon className="size-4" />,
              },
            ],
            {
              name: "list",
              groupName: "list",
              buttonProps: { "aria-label": "List" },
              icon: <ListIcon className="size-4" />,
            }
          ),
          {
            ...commands.code,
            buttonProps: { "aria-label": "Inline Code", title: formatMessage({ id: "editor.command.inline-code" }) },
            icon: <ChevronsLeftRightEllipsisIcon className="size-4" />,
          },
          {
            ...commands.codeBlock,
            buttonProps: { "aria-label": "Code Block", title: formatMessage({ id: "editor.command.code-block" }) },
            icon: <CodeXmlIcon className="size-4" />,
          },
          {
            ...commands.quote,
            buttonProps: { "aria-label": "Quote", title: formatMessage({ id: "editor.command.quote" }) },
            icon: <ListIndentIncreaseIcon className="size-4" />,
          },
          {
            ...commands.table,
            buttonProps: { "aria-label": "Table", title: formatMessage({ id: "editor.command.table" }) },
            icon: <Grid2x2PlusIcon className="size-4" />,
          },
          {
            ...commands.image,
            buttonProps: { "aria-label": "Image", title: formatMessage({ id: "editor.command.image" }) },
            icon: <ImageIcon className="size-4" />,
          },
        ]}
        preview={preview}
        extraCommands={[
          preview === "edit"
            ? {
                name: "preview",
                keyCommand: "preview",
                buttonProps: { "aria-label": "Preview", title: formatMessage({ id: "editor.command.preview" }) },
                icon: <EyeIcon className="size-4" />,
                execute: () => setPreview("preview"),
              }
            : {
                name: "edit",
                keyCommand: "preview",
                buttonProps: { "aria-label": "Edit", title: formatMessage({ id: "editor.command.edit" }) },
                icon: <PencilIcon className="size-4" />,
                execute: () => setPreview("edit"),
              },
        ]}
        height={150}
        {...props}
        value={state.value ?? undefined}
        onChange={(value) => handleChange(value ?? null)}
        onBlur={handleBlur}
        onPaste={async (event) => {
          if (!onUploadImage) return;
          const files = Array.from(event.clipboardData.items)
            .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
            .map((item) => item.getAsFile())
            .filter((f): f is File => f !== null);
          if (files.length === 0) return;
          event.preventDefault();
          for (const file of files) {
            try {
              const upload = await onUploadImage(file);
              if (!upload) continue;
              const imageMarkdown = `![${upload.alt}](${upload.url})`;
              handleChange((prev) => (prev ?? "") + imageMarkdown + " ");
            } catch (error) {
              console.error("Image upload failed", error);
            }
          }
        }}
        previewOptions={{
          urlTransform: (url) => {
            if (!url.startsWith("http")) {
              const attachment = attachments?.find((att) => att.filename === url);
              if (attachment) {
                return attachment.content_url;
              }
              const upload = uploads?.find((up) => up.filename === url);
              const { uploadId } = upload?.token.match(/^(?<uploadId>\d+)\..*$/)?.groups || {};
              if (upload && uploadId) {
                return `${settings.redmineURL}/attachments/download/${uploadId}/${upload.filename}`;
              }
            }
            return url;
          },
        }}
      />
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </Field>
  );
};
