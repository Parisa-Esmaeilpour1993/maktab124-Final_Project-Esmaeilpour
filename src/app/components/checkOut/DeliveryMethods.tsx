import { checkOutLocalization } from "@/app/constants/localization/fa/localization";
import { DeliveryMethod } from "@/app/types/deliveryMethods";

type DeliveryMethodsProps = {
  deliveryMethods: DeliveryMethod[];
  setSelectedDelivery: (method: DeliveryMethod) => void;
};

function DeliveryMethods({
  deliveryMethods,
  setSelectedDelivery,
}: DeliveryMethodsProps) {
  return (
    <div className="p-6 border rounded-xl shadow-accent space-y-4">
      <h2 className="text-lg font-semibold mb-4">
        {checkOutLocalization.deliveryMethod}
      </h2>
      <div className="space-y-4">
        {deliveryMethods.map((method: any) => (
          <div key={method.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery"
              value={method.id}
              onChange={() => setSelectedDelivery(method)}
              className="accent-primary"
            />
            <span>
              {method.name} - {method.minCost?.toLocaleString()} ریال
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryMethods;
