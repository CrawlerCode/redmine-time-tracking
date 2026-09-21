/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  rules: {
    // Tailwind's `@apply` prelude (e.g. `outline-ring/50`) isn't valid CSS syntax
    "at-rule-prelude-no-invalid": null,
  },
};
