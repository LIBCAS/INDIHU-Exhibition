declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.png";
declare module "react-md/*";

// Just to enable import in Typescript from react-md of version 1
declare module "react-md";

// Enable jpg imports
declare module "*.jpg";
