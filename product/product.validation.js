import Yup from "yup";

export const addProductValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .trim()
    .max(65, "Name must be at max 65 characters."),
  price: Yup.number()
    .required("Price is required.")
    .min(0, "Price cannot be negative number."),
  quantity: Yup.number()
    .required("Quantity is required.")
    .min(1, "Quantity must be at least 1."),
});
