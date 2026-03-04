if (typeof window !== "undefined") {
  throw new Error(
    "@/lib/services/payment must only be " +
      "imported server-side. " +
      "Never import in client components.",
  );
}

export { encrypt, decrypt, getMnemonic } from "./crypto";
