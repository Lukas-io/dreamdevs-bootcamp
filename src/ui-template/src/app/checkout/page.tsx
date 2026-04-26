"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/ui/EmptyState";

type Step = "shipping" | "payment" | "confirmation";

const STEPS: { key: Step; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [orderId] = useState(() => `ORD-${Date.now().toString().slice(-6)}`);

  // Shipping form
  const [shipping, setShipping] = useState({ fullName: "", email: "", address: "", city: "", state: "", zip: "", country: "Nigeria" });
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Payment form
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const shipping_fee = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping_fee;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<ShoppingBag size={36} />}
          title="Your cart is empty"
          action={<Link href="/products" className="mt-1 px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">Browse products</Link>}
        />
      </div>
    );
  }

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shipping.fullName.trim()) errs.fullName = "Required";
    if (!shipping.email.trim() || !shipping.email.includes("@")) errs.email = "Valid email required";
    if (!shipping.address.trim()) errs.address = "Required";
    if (!shipping.city.trim()) errs.city = "Required";
    if (!shipping.zip.trim()) errs.zip = "Required";
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (payment.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid card number";
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Format: MM/YY";
    if (payment.cvv.length < 3) errs.cvv = "Required";
    if (!payment.name.trim()) errs.name = "Required";
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingNext = () => { if (validateShipping()) setStep("payment"); };
  const handlePaymentNext = () => { if (validatePayment()) { clearCart(); setStep("confirmation"); } };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border ${err ? "border-red-400" : "border-neutral-200 dark:border-neutral-700"} rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400`;

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        {step !== "confirmation" && step !== "shipping" && (
          <button onClick={() => setStep(step === "payment" ? "shipping" : "payment")} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            <ArrowLeft size={14} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Checkout</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors
              ${i < stepIdx ? "bg-green-500 text-white" : i === stepIdx ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
              {i < stepIdx ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === stepIdx ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={`h-px w-8 ${i < stepIdx ? "bg-green-400" : "bg-neutral-200 dark:bg-neutral-700"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Shipping information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Full name</label>
                  <input value={shipping.fullName} onChange={(e) => setShipping((p) => ({ ...p, fullName: e.target.value }))} className={inputCls(shippingErrors.fullName)} placeholder="Jane Doe" />
                  {shippingErrors.fullName && <p className="text-xs text-red-500">{shippingErrors.fullName}</p>}
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Email</label>
                  <input type="email" value={shipping.email} onChange={(e) => setShipping((p) => ({ ...p, email: e.target.value }))} className={inputCls(shippingErrors.email)} placeholder="jane@example.com" />
                  {shippingErrors.email && <p className="text-xs text-red-500">{shippingErrors.email}</p>}
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Address</label>
                  <input value={shipping.address} onChange={(e) => setShipping((p) => ({ ...p, address: e.target.value }))} className={inputCls(shippingErrors.address)} placeholder="123 Main Street" />
                  {shippingErrors.address && <p className="text-xs text-red-500">{shippingErrors.address}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">City</label>
                  <input value={shipping.city} onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))} className={inputCls(shippingErrors.city)} placeholder="Lagos" />
                  {shippingErrors.city && <p className="text-xs text-red-500">{shippingErrors.city}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">State / Province</label>
                  <input value={shipping.state} onChange={(e) => setShipping((p) => ({ ...p, state: e.target.value }))} className={inputCls()} placeholder="Lagos State" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">ZIP / Postal code</label>
                  <input value={shipping.zip} onChange={(e) => setShipping((p) => ({ ...p, zip: e.target.value }))} className={inputCls(shippingErrors.zip)} placeholder="100001" />
                  {shippingErrors.zip && <p className="text-xs text-red-500">{shippingErrors.zip}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Country</label>
                  <input value={shipping.country} onChange={(e) => setShipping((p) => ({ ...p, country: e.target.value }))} className={inputCls()} placeholder="Nigeria" />
                </div>
              </div>
              <button onClick={handleShippingNext} className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer mt-2">
                Continue to Payment <ArrowRight size={14} />
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Payment details</h2>
              <p className="text-xs text-neutral-400">This is a UI template — no real payment is processed.</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Name on card</label>
                  <input value={payment.name} onChange={(e) => setPayment((p) => ({ ...p, name: e.target.value }))} className={inputCls(paymentErrors.name)} placeholder="Jane Doe" />
                  {paymentErrors.name && <p className="text-xs text-red-500">{paymentErrors.name}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-500">Card number</label>
                  <input
                    value={payment.cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setPayment((p) => ({ ...p, cardNumber: v.replace(/(.{4})/g, "$1 ").trim() }));
                    }}
                    className={inputCls(paymentErrors.cardNumber)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {paymentErrors.cardNumber && <p className="text-xs text-red-500">{paymentErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-500">Expiry</label>
                    <input
                      value={payment.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setPayment((p) => ({ ...p, expiry: v }));
                      }}
                      className={inputCls(paymentErrors.expiry)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {paymentErrors.expiry && <p className="text-xs text-red-500">{paymentErrors.expiry}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-500">CVV</label>
                    <input
                      value={payment.cvv}
                      onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      className={inputCls(paymentErrors.cvv)}
                      placeholder="123"
                      maxLength={4}
                    />
                    {paymentErrors.cvv && <p className="text-xs text-red-500">{paymentErrors.cvv}</p>}
                  </div>
                </div>
              </div>
              <button onClick={handlePaymentNext} className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer mt-2">
                Place Order · ${grandTotal.toFixed(2)}
              </button>
            </div>
          )}

          {step === "confirmation" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Order placed!</h2>
                <p className="text-sm text-neutral-500 mt-1">Order ID: <span className="font-mono font-medium">{orderId}</span></p>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs">
                We&apos;ve received your order and will send a confirmation to <strong>{shipping.email || "your email"}</strong>.
              </p>
              <div className="flex gap-3 mt-2">
                <Link href="/orders" className="px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  View orders
                </Link>
                <Link href="/products" className="px-4 py-2 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {step !== "confirmation" && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 h-fit flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Your order</h2>
            <div className="flex flex-col gap-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">{product.name}</p>
                    <p className="text-xs text-neutral-400">×{quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex flex-col gap-1.5 text-xs text-neutral-500">
              <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping_fee === 0 ? "Free" : `$${shipping_fee.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span>Total</span><span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
