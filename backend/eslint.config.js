import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

// Configuração local para o código TypeScript do backend, separada do ESLint do React.
export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: { projectService: true }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
);
