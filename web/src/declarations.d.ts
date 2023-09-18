declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// Enable .jpg and .png imports
declare module "*.jpg";
declare module "*.png";

// Just to enable import in Typescript from react-md of version 1
declare module "react-md/*";
declare module "react-md";
