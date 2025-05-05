import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { GiHealthPotion } from "react-icons/gi";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

function DescriptionSide() {
  return (
    <div>
      <div className="flex justify-center items-center gap-2 mb-4">
        <TbTruckDelivery size={24} className="text-primary" />
        <GiHealthPotion size={24} className="text-primary" />
        <MdOutlineLocalPharmacy size={24} className="text-primary" />
        <FaUserDoctor size={24} className="text-primary" />
      </div>
      <div>
        <div className="text-sm border-b pb-2">
          <h2 className="font-semibold mb-1">تضمین کیفیت</h2>
          <p>بررسی و کنترل نهایی توسط دکتر داروساز</p>
        </div>
        <div className="text-sm border-b py-2">
          <h2 className="font-semibold mb-1">اصالت کالا</h2>
          <p>دارای مجوز رسمی از سازمان غذا و دارو</p>
        </div>
        <div className="text-sm border-b py-2">
          <h2 className="font-semibold mb-2">ارسال رایگان</h2>
          <p>ارسال رایگان سفارشات بالای 800 هزار تومان</p>
        </div>
        <div className="text-sm border-b py-2">
          <p>هزینه ارسال به سراسر کشور 40 هزار تومان</p>
        </div>
      </div>
    </div>
  );
}

export default DescriptionSide;
