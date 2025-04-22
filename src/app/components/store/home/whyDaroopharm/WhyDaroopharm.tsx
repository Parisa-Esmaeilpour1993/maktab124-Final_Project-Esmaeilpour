"use client";

import { motion } from "framer-motion";
import { asideBarLocalization } from "@/app/constants/localization/fa/localization";
import { features } from "@/app/utils/features";

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 100,
    },
  }),
};

export default function WhyDaroopharm() {
  return (
    <section className="mx-16 rounded-md mb-4 shadow-accent py-20 bg-gradient-to-br from-accent to-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">
          چرا{" "}
          <span className="text-red-600">{asideBarLocalization.storeName}</span>{" "}
          را انتخاب کنیم؟
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-6 shadow-accent hover:shadow-secondary cursor-default"
            >
              <div className="flex justify-center items-center mb-4">
                <feature.icon className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
