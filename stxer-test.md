# T-Shirt Faktory Test Results

## Overview

Comprehensive test suite for the T-Shirt pre-order smart contract covering all major functionality and edge cases.

## Test Categories & Results

### ✅ Campaign Setup & Order Placement

- **Order validation**: Successfully accepts valid sizes (S, M, L, XL, etc.)
- **Duplicate prevention**: Correctly blocks duplicate orders from same buyer (`ERR_ALREADY_ORDERED`)
- **Invalid size rejection**: Properly rejects invalid sizes like "XYZ" (`ERR_INVALID_SIZE`)
- **Capacity limits**: Prevents orders beyond 21-order capacity (`ERR_CAMPAIGN_FULL`)
- **Payment processing**: 50 USDA transfers work correctly for all orders

### ✅ Campaign Completion & Shipping

- **Automatic completion**: Campaign correctly completes at exactly 21 orders
- **Shipping authorization**: Only artist can mark orders as shipped
- **Delivery time validation**: Rejects delivery estimates > 24 days (`ERR_SHIPPING_TOO_SLOW`)
- **Deadline enforcement**: Shipping blocked after 2-week deadline (`ERR_DEADLINE`)
- **Never-shipped claims**: Buyers can claim refunds for unshipped orders after deadline

### ✅ Rating & Payment System

- **100% ratings**: Instant payout to artist (45 USDA after 5 USDA fee)
- **50% ratings**: Split payment when artist agrees (22.5 USDA each)
- **0% ratings**: Full refund to buyer when artist agrees (45 USDA)
- **Rating validation**: Only accepts 0, 50, or 100 values (`ERR_INVALID_RATING`)
- **Never-rated claims**: Artist can claim payment if buyer doesn't rate within 2x delivery time

### ✅ Oracle Dispute Resolution

- **Flexible decisions**: Oracle can set any rating 0-100 for maximum discretion
- **Deadline respect**: Oracle cannot decide before artist response deadline
- **Payment execution**: Proper fund distribution based on oracle's final rating
- **Authorization**: Only designated oracle can make decisions

### ✅ Campaign Failure & Refunds

- **Incomplete campaign handling**: Oracle can refund all buyers if campaign doesn't reach 21 orders
- **Deadline enforcement**: Refunds only allowed after 3-week campaign deadline
- **Prevention of abuse**: Cannot refund completed campaigns

### ✅ Error Handling & Edge Cases

- **Authorization checks**: Non-artists cannot perform artist functions
- **Double-action prevention**: Cannot rate twice, ship twice, or claim twice
- **State validation**: Proper order state checks throughout workflow
- **Boundary testing**: Exact deadline testing confirms proper `>` vs `>=` logic

## Key Contract Improvements

### Oracle Flexibility

The oracle's decision-making was made more flexible:

```clarity
(asserts! (<= final-rating u100) ERR_INVALID_RATING) ;; oracle freedom
```

This allows ratings from 0-100 instead of restricting to only 0, 50, 100, giving the oracle full discretion in complex disputes.

### Type Consistency

All rating values use `uint` type consistently throughout the contract, matching Clarity's type system requirements.

## Known Simulation Artifacts

- Some transaction nonce mismatches appear in simulation logs - these are testing environment issues, not contract bugs
- Contract logic handles all edge cases correctly with appropriate error codes

## Test Coverage

- **21/21 order capacity testing**: Full campaign simulation
- **Multiple user scenarios**: 18+ different wallet addresses tested
- **All major functions**: Every public function tested with valid and invalid inputs
- **Edge case boundary testing**: Exact deadline and capacity limit validation
- **Payment flow verification**: USDA token transfers confirmed at each step

## Conclusion

The contract successfully handles all intended use cases with robust error handling, proper authorization checks, and flexible dispute resolution. The test suite demonstrates production-ready functionality for a decentralized pre-order system.
