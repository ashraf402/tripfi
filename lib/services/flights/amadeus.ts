import Amadeus from "amadeus";

if (!process.env.AMADEUS_CLIENT_ID) {
  throw new Error(
    "[Amadeus] AMADEUS_CLIENT_ID is not set in .env. " +
      "Register at developers.amadeus.com",
  );
}

if (!process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error(
    "[Amadeus] AMADEUS_CLIENT_SECRET is not set in .env. " +
      "Register at developers.amadeus.com",
  );
}

const isProduction = process.env.AMADEUS_ENV === "production";

export const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: isProduction ? "production" : "test",
});

export const AMADEUS_ENV = process.env.AMADEUS_ENV ?? "test";

console.log(
  `[Amadeus] Initialized in ${isProduction ? "PRODUCTION" : "TEST"} mode`,
);
