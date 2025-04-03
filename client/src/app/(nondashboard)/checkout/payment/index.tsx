"use client";

import CoursePreview from "@/components/CoursePreview";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { toast } from "sonner";
import { useCreateTransactionMutation } from "@/state/api";

declare global {
  interface Window {
    Razorpay: /* eslint-disable-line @typescript-eslint/no-explicit-any */ any;
  }
}

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createTransaction] = useCreateTransactionMutation();
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!course) return null;

  const price = formatPrice(course.price);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/transactions/payments/",
        { amount: course.price }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay API Key
        amount: data.order.amount, // Amount in paisa (smallest currency unit)
        currency: data.order.currency,
        name: "Learn Pro",
        description: course.title,
        order_id: data.order.id, // Razorpay order ID
        handler: async function (
          response: /* eslint-disable-line @typescript-eslint/no-explicit-any */ any
        ) {
          if (response) {
            const transactionData: Partial<Transaction> = {
              transactionId: response.razorpay_payment_id,
              userId: user?.id,
              courseId: courseId,
              paymentProvider: "Razorpay",
              amount: course.price || 0,
            };
            await createTransaction(transactionData);
            navigateToStep(3);
          }
          toast.success("Payment Successful!");
        },
        prefill: {
          name: user?.fullName, // Replace with dynamic user data
          email: user?.emailAddresses[0].emailAddress, // Replace with dynamic user data
        },
        theme: {
          color: "bg-customgreys-secondarybg",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Failed", error);
      toast.error("Payment Failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOutandNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="sm:flex gap-10 mb-6">
        <div className="basis-1/2 rounded-lg">
          <CoursePreview course={course} isSelected={true} />
          <Button
            className="hover:bg-white-50/10 mt-10"
            variant="outline"
            type="button"
            onClick={handleSignOutandNavigate}
          >
            Switch Account
          </Button>
        </div>

        <div className="basis-1/2">
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <div className="w-full bg-customgreys-secondarybg py-8 px-10 flex flex-col gap-5 rounded-lg">
            <h3 className="text-xl mb-4">Price Details (1 item)</h3>
            <div className="flex justify-between mb-4 text-customgreys-dirtyGrey text-base">
              <span className="font-bold">1x {course.title}</span>
              <span className="font-bold">{price}</span>
            </div>
            <div className="flex justify-between border-t border-customgreys-dirtyGrey pt-4">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-lg">{price}</span>
            </div>

            <Button
              onClick={handlePayment}
              className="hover:bg-primary-600 bg-primary-700 mt-5"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Make Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
