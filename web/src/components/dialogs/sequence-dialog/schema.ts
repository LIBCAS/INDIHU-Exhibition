import * as Yup from "yup";

export const sequenceSchema = Yup.object({
  text: Yup.string().required("*Povinné").max(150, "*Maximálně 150 znaků."),
  zoom: Yup.number().min(1, "Nemůže být menší než jedna").required("*Povinné"),
  time: Yup.number().min(1, "Nemůže být menší než jedna").required("*Povinné"),
  stayInDetailTime: Yup.number()
    .min(1, "Nemůže být menší než jedna")
    .required("*Povinné"),
});
