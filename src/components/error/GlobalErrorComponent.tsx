import { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent } from "./ErrorComponent";

export function GlobalErrorComponent(props: ErrorComponentProps) {
  return (
    <main>
      <div className="p-2">
        <ErrorComponent {...props} />
      </div>
    </main>
  );
}
