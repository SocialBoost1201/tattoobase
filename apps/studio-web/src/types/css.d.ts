// Allow CSS file imports (used in Next.js layout)
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
