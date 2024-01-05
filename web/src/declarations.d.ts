declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// Enable .jpg and .png
declare module "*.jpg";
declare module "*.png";

declare module "*.mp4";

// Just to enable import in Typescript from react-md of version 1
declare module "react-md/*";
declare module "react-md";

// To enable import in Typescript of old react google recaptcha of v1
declare module "react-google-recaptcha";
