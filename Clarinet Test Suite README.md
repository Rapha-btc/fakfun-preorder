# T-Shirt Contract Test Suite

Comprehensive test suite for the T-Shirt Pre-Order Contract using Clarinet/Vitest framework.

## Test Overview

**Total Tests**: 40 passing tests covering all contract functionality

## Test Structure

### 1. Setup Verification (1 test)

- **Funding verification**: Ensures all test accounts have proper USDA and STX balances

### 2. Basic Functionality (5 tests)

- **Contract deployment**: Verifies artist setup
- **Valid orders**: Tests successful order placement
- **Duplicate prevention**: Ensures one order per buyer
- **Size validation**: Rejects invalid t-shirt sizes
- **Campaign completion**: Tests 21-order target
- **Capacity limits**: Prevents orders beyond 21

### 3. Time-Dependent Logic (13 tests)

#### Shipping Deadlines (4 tests)

- **Within deadline**: Shipping allowed within 2 weeks
- **After deadline**: Shipping rejected after 2 weeks
- **Exact boundary**: Tests precise deadline enforcement
- **Never shipped refunds**: Buyer claims for unshipped items

#### Rating Deadlines (2 tests)

- **Never rated claims**: Artist claims payment for unrated deliveries
- **Boundary conditions**: Tests exact deadline timing

#### Oracle Decision Timing (4 tests)

- **Immediate decisions**: Oracle can decide after artist responds
- **Deadline enforcement**: Oracle must wait if artist hasn't responded
- **Post-deadline decisions**: Oracle can decide after response window
- **No response handling**: Oracle decides when artist never responds

#### Campaign Failure Scenarios (3 tests)

- **Incomplete campaign protection**: Prevents premature refunds
- **Failed campaign refunds**: Allows refunds after deadline
- **Completed campaign protection**: Prevents refunds of successful campaigns

### 4. Complete Decision Tree Testing (7 tests)

#### 100% Rating Branch (1 test)

- **Instant payout**: Immediate artist payment for perfect rating

#### 50% Rating Branches (3 tests)

- **Artist agreement**: 50/50 split when artist accepts
- **Artist disagreement**: Oracle resolution after dispute
- **No artist response**: Oracle decides when artist doesn't respond

#### 0% Rating Branches (3 tests)

- **Artist agreement**: Full refund when artist accepts
- **Artist disagreement**: Oracle resolution after dispute
- **No artist response**: Oracle decides when artist doesn't respond

### 5. Edge Cases and Error Handling (9 tests)

- **Invalid ratings**: Rejects ratings other than 0, 50, 100
- **Delivery limits**: Rejects estimates over 24 days
- **Double claim prevention**: Prevents multiple rating attempts
- **Authorization checks**: Prevents unauthorized shipping
- **Oracle freedom**: Tests oracle's 0-100% rating flexibility
- **Invalid oracle ratings**: Rejects ratings over 100%
- **Concurrent disputes**: Handles multiple simultaneous disputes
- **Deadline boundaries**: Tests exact timing edge cases

### 6. Balance Verification (3 tests)

- **100% payment flow**: Verifies correct fund distribution
- **50% split flow**: Tests partial payment calculations
- **Contract balance tracking**: Ensures proper accounting

### 7. Integration Tests (2 tests)

- **Mixed workflow**: Complete end-to-end scenarios
- **Full edge case coverage**: Comprehensive integration testing

## Test Environment Setup

### Accounts Used

- **Deployer**: Contract deployer and oracle
- **Artist**: T-shirt creator
- **Buyers**: 22 unique mainnet addresses for comprehensive testing
- **USDA Holder**: Mainnet address with large USDA balance for funding

### Funding Strategy

- **USDA Minting**: 50k USDA minted to holder for distribution
- **Account Funding**:
  - Oracle: 100 USDA
  - Artist: 100 USDA
  - Test Buyers: 1000 USDA each
  - Mainnet Buyers: 100 USDA each
- **STX Gas**: 1 STX provided to all accounts

## Key Testing Patterns

### Balance Calculations

Tests use the nested Clarity value structure:

```typescript
const balance = Number(response.result.value.value);
```

### Time-Based Testing

Simnet block mining for deadline testing:

```typescript
simnet.mineEmptyBlocks(2017); // Past 2-week deadline
```

### Error Code Verification

All error conditions tested with specific error codes:

```typescript
expect(result.result).toBeErr(Cl.uint(108)); // ERR_INVALID_RATING
```

## Running Tests

```bash
clarinet test
```

## Test Coverage Summary

✅ **All major branches covered**:

- Campaign completion/failure scenarios
- All rating combinations (0%, 50%, 100%)
- All dispute resolution paths
- All deadline enforcement mechanisms
- All error conditions and edge cases
- Complete payment distribution flows

The test suite provides comprehensive coverage of the contract's decision tree, ensuring all possible user interactions and edge cases are thoroughly validated.

## Branch Coverage Analysis

### Decision Tree Coverage vs. Project README

**✅ FULLY COVERED BRANCHES:**

1. **Campaign never reaches 21 orders** → `oracle-refund-incomplete-campaign()`

   - Test: "should allow refund of incomplete campaign after deadline"

2. **Artist NEVER ships** → `claim-never-shipped()`

   - Test: "should allow buyers to claim refund for never-shipped items"

3. **Buyer NEVER rates** → `claim-never-rated()`

   - Test: "should allow artist to claim payment if buyer never rates"

4. **Buyer rates 100%** → Instant payout

   - Test: "should handle 100% rating with instant payout"

5. **Buyer rates 50% + artist agrees** → 50/50 split

   - Test: "should handle 50% rating + artist agreement"

6. **Buyer rates 50% + artist disagrees + oracle decides** → Oracle resolution

   - Test: "should handle 50% rating + artist disagreement + oracle decision"

7. **Buyer rates 50% + artist never responds + oracle decides** → Oracle resolution

   - Test: "should handle 50% rating + no artist response + oracle decision"

8. **Buyer rates 0% + artist agrees** → Full refund

   - Test: "should handle 0% rating + artist agreement for full refund"

9. **Buyer rates 0% + artist disagrees + oracle decides** → Oracle resolution

   - Test: "should handle 0% rating + artist disagreement + oracle decision"

10. **Buyer rates 0% + artist never responds + oracle decides** → Oracle resolution
    - Test: "should handle 0% rating + no artist response + oracle decision"

### Additional Coverage Beyond Decision Tree

**✅ COMPREHENSIVE EDGE CASES:**

- Invalid ratings, delivery estimates, and authorization failures
- Boundary conditions and exact deadline testing
- Concurrent dispute handling
- Balance verification and payment flow validation
- Error code verification for all failure modes

### Coverage Verdict

**100% DECISION TREE COVERAGE** - Every branch described in the project README is thoroughly tested, plus extensive edge case validation ensures robust contract behavior under all conditions.
