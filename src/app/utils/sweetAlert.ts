import Swal from "sweetalert2";
import { sweetAlert } from "../constants/localization/fa/localization";

export const confirmDelete = () => {
  return Swal.fire({
    title: sweetAlert.areYouSure,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: sweetAlert.del,
    cancelButtonText: sweetAlert.cancel,
  });
};

export const successDelete = () => {
  return Swal.fire({
    title: sweetAlert.delete,
    text: sweetAlert.deleteProduct,
    icon: "success",
    confirmButtonText: sweetAlert.ok,
  });
};

export const unSuccessDelete = () => {
  return Swal.fire(sweetAlert.error, sweetAlert.errorInDeleteData, "error");
};
