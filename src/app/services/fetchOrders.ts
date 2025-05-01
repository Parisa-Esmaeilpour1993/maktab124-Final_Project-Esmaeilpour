import { toast } from "react-toastify";
import { sweetAlert } from "../constants/localization/fa/localization";
import { API_KEY, BASE_url } from "../constants/api/BASE_URL";
import axios from "axios";

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_url}/api/records/orders`, {
      headers: { api_key: API_KEY },
    });

    const fetchedOrders = response.data.records.map((item: any) => ({
      id: item.id,
      isDelivered: item.isDelivered,
      customer: `${item.firstName} ${item.lastName}`,
      createdAt: item.createdAt,
      totalPrice: item.totalPrice,
      finalAmount: item.finalAmount,
      phone: item.phone,
      address: item.address,
      deliveryStatus: item.isDelivered,
      deliveryTime: item.deliveryTime,
      deliveryDate: item.deliveryDate,
      discountCode: item.discountCode,
      validDiscount: item.validDiscount,
      finalShippingCost: item.finalShippingCost,
      items: item.products.map((p: any) => ({
        name: p.name,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        discountPercent: p.discountPercent,
        price: p.total,
      })),
      deliveryMethods: {
        name: item.deliveryMethod.name,
        cost: item.deliveryMethod.cost,
      },
    }));

    return fetchedOrders;
  } catch (err: any) {
    toast.error(sweetAlert.error);
    console.error(err);
    return [];
  }
};
