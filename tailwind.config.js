import basicConfig from "../../tailwind.config.js";

basicConfig.content.push(
  "../../node_modules/@cs-magic/common/dist/**/*",
  "../../node_modules/@cs-magic/common-frontend/dist/**/*",
  "../../node_modules/@cs-magic/shadcn/dist/**/*",
  "../../node_modules/@cs-magic/react/dist/**/*",

  "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./mdx-components.tsx",
  "./content/**/*.mdx",
);
export default basicConfig;
