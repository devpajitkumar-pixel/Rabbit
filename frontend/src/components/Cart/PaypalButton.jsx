import React, { useMemo } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  const stableAmount = useMemo(() => amount.toString(), []);
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AbH899tywamm0SzObNf-KeS46i4THuENFbWiTs53CT3xOW_Rn9wxl7yYBGVPOvXYAjS1zb80VfuyOF6v",
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: stableAmount, // 🔴 VERY IMPORTANT
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          onSuccess(details);
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
