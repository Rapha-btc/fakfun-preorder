import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const oracle = deployer; // Oracle is the deployer
const artist = accounts.get("wallet_1")!;
const buyer1 = accounts.get("wallet_2")!;
const buyer2 = accounts.get("wallet_3")!;
const buyer3 = accounts.get("wallet_4")!;

const contractName = "tshirt-preorder";
const usdaContract = "usda-token";

describe("T-Shirt Pre-Order Contract Tests", () => {
  beforeEach(() => {
    simnet.setEpoch("3.0");

    // Mint USDA tokens for testing
    [deployer, artist, buyer1, buyer2, buyer3].forEach((account) => {
      simnet.callPublicFn(
        usdaContract,
        "mint",
        [Cl.uint(1000000000), Cl.principal(account)], // 1000 USDA
        deployer
      );
    });

    // Set artist
    simnet.callPublicFn(
      contractName,
      "set-artist",
      [Cl.principal(artist)],
      oracle
    );
  });

  describe("Campaign Setup & Order Placement", () => {
    it("should allow valid orders with correct payment", () => {
      const result = simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        buyer1
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check order was recorded
      const order = simnet.callReadOnlyFn(
        contractName,
        "get-order",
        [Cl.principal(buyer1)],
        deployer
      );
      expect(order.result.type).toBe("some");
    });

    it("should prevent duplicate orders from same buyer", () => {
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      const duplicate = simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        buyer1
      );

      expect(duplicate.result).toBeErr(Cl.uint(101)); // ERR_ALREADY_ORDERED
    });

    it("should reject invalid sizes", () => {
      const result = simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("INVALID")],
        buyer1
      );

      expect(result.result).toBeErr(Cl.uint(105)); // ERR_INVALID_SIZE
    });

    it("should prevent orders beyond campaign capacity", () => {
      // Fill campaign to capacity (21 orders)
      const buyers = [buyer1, buyer2, buyer3];
      for (let i = 0; i < 21; i++) {
        const buyer = buyers[i % buyers.length];
        if (i < 3) {
          simnet.callPublicFn(
            contractName,
            "place-order",
            [Cl.stringAscii("M")],
            buyer
          );
        } else {
          // Need different addresses for remaining orders
          const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
          simnet.callPublicFn(
            usdaContract,
            "mint",
            [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
            deployer
          );
          simnet.callPublicFn(
            contractName,
            "place-order",
            [Cl.stringAscii("M")],
            uniqueBuyer
          );
        }
      }

      // Try 22nd order
      const extraOrder = simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        "ST999999999999999999999999999999999999999"
      );

      expect(extraOrder.result).toBeErr(Cl.uint(102)); // ERR_CAMPAIGN_FULL
    });
  });

  describe("Campaign Completion & Shipping", () => {
    beforeEach(() => {
      // Place orders to complete campaign
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        buyer2
      );

      // Complete campaign with remaining orders
      for (let i = 3; i <= 21; i++) {
        const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
        simnet.callPublicFn(
          usdaContract,
          "mint",
          [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
          deployer
        );
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          uniqueBuyer
        );
      }
    });

    it("should allow artist to mark orders as shipped within deadline", () => {
      const result = simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)], // 7 days delivery
        artist
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Verify order updated
      const order = simnet.callReadOnlyFn(
        contractName,
        "get-order",
        [Cl.principal(buyer1)],
        deployer
      );
      const orderData = order.result.value.data;
      expect(orderData["shipped-block"].type).toBe("some");
    });

    it("should reject shipping after deadline", () => {
      // Mine blocks past shipping deadline (2016 blocks = 2 weeks)
      simnet.mineEmptyBlocks(2017);

      const result = simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        artist
      );

      expect(result.result).toBeErr(Cl.uint(111)); // ERR_DEADLINE
    });

    it("should reject excessive delivery estimates", () => {
      const result = simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(25)], // 25 days > 24 max
        artist
      );

      expect(result.result).toBeErr(Cl.uint(112)); // ERR_SHIPPING_TOO_SLOW
    });

    it("should allow buyers to claim refund if never shipped", () => {
      // Mine blocks past shipping deadline
      simnet.mineEmptyBlocks(2017);

      const result = simnet.callPublicFn(
        contractName,
        "claim-never-shipped",
        [Cl.principal(buyer1)],
        buyer1
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check order marked as 0% rating (refund)
      const order = simnet.callReadOnlyFn(
        contractName,
        "get-order",
        [Cl.principal(buyer1)],
        deployer
      );
      const rating = order.result.value.data.rating;
      expect(rating.value.value).toBe(0n);
    });
  });

  describe("Rating & Payment System", () => {
    beforeEach(() => {
      // Complete campaign and ship items
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        buyer2
      );

      // Complete remaining orders
      for (let i = 3; i <= 21; i++) {
        const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
        simnet.callPublicFn(
          usdaContract,
          "mint",
          [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
          deployer
        );
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          uniqueBuyer
        );
      }

      // Ship orders
      simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        artist
      );
      simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer2), Cl.uint(10)],
        artist
      );
    });

    it("should process 100% rating with instant payout", () => {
      const artistBalanceBefore = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(artist)],
        deployer
      );

      const result = simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(100)],
        buyer1
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check payment to artist (45 USDA after 5 USDA fee)
      const artistBalanceAfter = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(artist)],
        deployer
      );

      const payment =
        artistBalanceAfter.result.value - artistBalanceBefore.result.value;
      expect(payment).toBe(45000000n); // 45 USDA in micro units
    });

    it("should handle 50% rating with artist agreement", () => {
      // Buyer rates 50%
      simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(50)],
        buyer1
      );

      // Artist agrees to 50% split
      const result = simnet.callPublicFn(
        contractName,
        "artist-respond",
        [Cl.principal(buyer1), Cl.bool(true)],
        artist
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check both parties got 22.5 USDA
      const artistBalance = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(artist)],
        deployer
      );
      const buyerBalance = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(buyer1)],
        deployer
      );

      // Artist gets 22.5 USDA (from initial 1000 USDA)
      expect(artistBalance.result.value).toBe(1022500000n);
      // Buyer gets 22.5 USDA refund (1000 - 50 + 22.5 = 972.5 USDA)
      expect(buyerBalance.result.value).toBe(972500000n);
    });

    it("should handle 0% rating with artist agreement for full refund", () => {
      const buyerBalanceBefore = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(buyer1)],
        deployer
      );

      // Buyer rates 0%
      simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(0)],
        buyer1
      );

      // Artist agrees to full refund
      const result = simnet.callPublicFn(
        contractName,
        "artist-respond",
        [Cl.principal(buyer1), Cl.bool(true)],
        artist
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check buyer got 45 USDA refund
      const buyerBalanceAfter = simnet.callReadOnlyFn(
        usdaContract,
        "get-balance",
        [Cl.principal(buyer1)],
        deployer
      );

      const refund =
        buyerBalanceAfter.result.value - buyerBalanceBefore.result.value;
      expect(refund).toBe(45000000n); // 45 USDA refund
    });

    it("should allow artist to claim payment if buyer never rates", () => {
      // Mine blocks past rating deadline (2x delivery time)
      // 7 days delivery = 14 days rating deadline = ~4032 blocks
      simnet.mineEmptyBlocks(4033);

      const result = simnet.callPublicFn(
        contractName,
        "claim-never-rated",
        [Cl.principal(buyer1)],
        artist
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check order marked as 100% rating
      const order = simnet.callReadOnlyFn(
        contractName,
        "get-order",
        [Cl.principal(buyer1)],
        deployer
      );
      const rating = order.result.value.data.rating;
      expect(rating.value.value).toBe(100n);
    });
  });

  describe("Oracle Dispute Resolution", () => {
    beforeEach(() => {
      // Setup completed campaign with shipped items
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      for (let i = 2; i <= 21; i++) {
        const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
        simnet.callPublicFn(
          usdaContract,
          "mint",
          [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
          deployer
        );
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          uniqueBuyer
        );
      }

      simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        artist
      );
    });

    it("should allow oracle to decide disputed ratings", () => {
      // Buyer rates 50%
      simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(50)],
        buyer1
      );

      // Artist disagrees
      simnet.callPublicFn(
        contractName,
        "artist-respond",
        [Cl.principal(buyer1), Cl.bool(false)],
        artist
      );

      // Mine blocks past artist response deadline (0.5x delivery days)
      simnet.mineEmptyBlocks(505); // ~3.5 days for 7-day delivery

      // Oracle decides 75% (not a standard option, but oracle can decide)
      const result = simnet.callPublicFn(
        contractName,
        "oracle-decide",
        [Cl.principal(buyer1), Cl.uint(100)], // Oracle decides 100%
        oracle
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check final rating was set
      const order = simnet.callReadOnlyFn(
        contractName,
        "get-order",
        [Cl.principal(buyer1)],
        deployer
      );
      const rating = order.result.value.data.rating;
      expect(rating.value.value).toBe(100n);
    });

    it("should prevent oracle decision before deadline", () => {
      // Buyer rates 50%, artist disagrees
      simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(50)],
        buyer1
      );
      simnet.callPublicFn(
        contractName,
        "artist-respond",
        [Cl.principal(buyer1), Cl.bool(false)],
        artist
      );

      // Try oracle decision before deadline
      const result = simnet.callPublicFn(
        contractName,
        "oracle-decide",
        [Cl.principal(buyer1), Cl.uint(0)],
        oracle
      );

      expect(result.result).toBeErr(Cl.uint(111)); // ERR_DEADLINE
    });
  });

  describe("Campaign Failure & Refunds", () => {
    it("should allow oracle to refund incomplete campaign after deadline", () => {
      // Place only a few orders (less than 21)
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("L")],
        buyer2
      );
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("S")],
        buyer3
      );

      // Mine blocks past campaign deadline (3024 blocks = 3 weeks)
      simnet.mineEmptyBlocks(3025);

      const result = simnet.callPublicFn(
        contractName,
        "oracle-refund-incomplete-campaign",
        [],
        oracle
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check campaign status set to 0 (refunded)
      const status = simnet.callReadOnlyFn(
        contractName,
        "get-campaign-status",
        [],
        deployer
      );
      // Campaign should show incomplete orders
      expect(status.result.value.data.orders.value).toBeLessThan(21n);
    });

    it("should prevent refund of completed campaigns", () => {
      // Complete campaign
      for (let i = 1; i <= 21; i++) {
        const buyer =
          i <= 3
            ? [buyer1, buyer2, buyer3][i - 1]
            : `ST${i.toString().padStart(39, "0")}`;
        if (i > 3) {
          simnet.callPublicFn(
            usdaContract,
            "mint",
            [Cl.uint(100000000), Cl.principal(buyer)],
            deployer
          );
        }
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          buyer
        );
      }

      // Mine blocks past campaign deadline
      simnet.mineEmptyBlocks(3025);

      const result = simnet.callPublicFn(
        contractName,
        "oracle-refund-incomplete-campaign",
        [],
        oracle
      );

      expect(result.result).toBeErr(Cl.uint(102)); // ERR_CAMPAIGN_FULL
    });

    it("should prevent early refund before deadline", () => {
      // Place incomplete orders
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      // Try refund before deadline
      const result = simnet.callPublicFn(
        contractName,
        "oracle-refund-incomplete-campaign",
        [],
        oracle
      );

      expect(result.result).toBeErr(Cl.uint(114)); // ERR_CAMPAIGN_ONGOING
    });
  });

  describe("Error Handling & Edge Cases", () => {
    it("should reject invalid rating values", () => {
      // Setup shipped order
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      for (let i = 2; i <= 21; i++) {
        const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
        simnet.callPublicFn(
          usdaContract,
          "mint",
          [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
          deployer
        );
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          uniqueBuyer
        );
      }

      simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        artist
      );

      // Try invalid rating
      const result = simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(75)], // Invalid - only 0, 50, 100 allowed
        buyer1
      );

      expect(result.result).toBeErr(Cl.uint(108)); // ERR_INVALID_RATING
    });

    it("should prevent unauthorized actions", () => {
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      // Non-artist tries to mark shipped
      const result = simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        buyer2 // Not the artist
      );

      expect(result.result).toBeErr(Cl.uint(100)); // ERR_UNAUTHORIZED
    });

    it("should prevent double claims", () => {
      // Setup and complete one rating
      simnet.callPublicFn(
        contractName,
        "place-order",
        [Cl.stringAscii("M")],
        buyer1
      );

      for (let i = 2; i <= 21; i++) {
        const uniqueBuyer = `ST${i.toString().padStart(39, "0")}`;
        simnet.callPublicFn(
          usdaContract,
          "mint",
          [Cl.uint(100000000), Cl.principal(uniqueBuyer)],
          deployer
        );
        simnet.callPublicFn(
          contractName,
          "place-order",
          [Cl.stringAscii("M")],
          uniqueBuyer
        );
      }

      simnet.callPublicFn(
        contractName,
        "mark-shipped",
        [Cl.principal(buyer1), Cl.uint(7)],
        artist
      );
      simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(100)],
        buyer1
      );

      // Try to rate again
      const result = simnet.callPublicFn(
        contractName,
        "buyer-rates-delivery",
        [Cl.uint(0)],
        buyer1
      );

      expect(result.result).toBeErr(Cl.uint(113)); // ERR_ALREADY_CLAIMED
    });
  });
});
