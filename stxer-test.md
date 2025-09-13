# STXER Testing Documentation

## Overview

This document explains the testing approach for the t-shirt pre-order contract using both STXER simulations and Clarinet unit tests.

## Current Testing Status

### STXER Simulation (Mainnet Fork)

- ✅ **Contract deployment and basic functionality**
- ✅ **USDA token transfers and funding**
- ✅ **Complete campaign workflow (21 orders)**
- ✅ **Order placement with validation**
- ✅ **Artist assignment and shipping**
- ✅ **Payment distribution scenarios**
- ✅ **Balance verification**

### Limitations of STXER

- ❌ **Cannot advance chain tip (mine blocks)**
- ❌ **Cannot test time-dependent logic**
- ❌ **Cannot test deadline-based functions**
- ❌ **Limited oracle decision testing**

## Testing Strategy

### STXER Simulations

Use STXER for testing:

- Contract deployment on mainnet fork
- Basic functional workflows
- Token transfer mechanics
- Payment calculations
- Balance verification
- Happy path scenarios

### Clarinet Unit Tests

Use Clarinet for testing:

- Time-dependent logic (block advancement)
- Deadline enforcement
- Oracle decision timing
- Campaign failure scenarios
- Edge cases and error conditions
- All decision tree branches

## Test Coverage Gaps

The following scenarios require Clarinet testing due to time dependencies:

### Time-Dependent Scenarios

1. **Shipping deadline enforcement** (2 weeks after campaign completion)
2. **Rating deadline** (2x delivery time)
3. **Artist response deadline** (0.5x delivery time)
4. **Oracle decision timing** (after artist response deadline)
5. **Campaign completion deadline** (3 weeks)
6. **Never-shipped refund claims**
7. **Never-rated artist claims**

### Decision Tree Branches

- 50% rating + artist disagreement → oracle decision
- 0% rating + artist disagreement → oracle decision
- 50% rating + no artist response → oracle decision
- 0% rating + no artist response → oracle decision
- Exact deadline boundary testing

## Running Tests

### STXER Simulation

```bash
npm install stxer@0.4.3
node simulate.js
```

Expected output: Simulation URL with 92 successful steps

### Clarinet Unit Tests

```bash
clarinet test
```

## Test Environment Setup

Both testing environments use:

- **USDA Token Contract**: `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token`
- **USDA Holder**: `SP3JYMPETBPP4083YFDKF9DP9Y2CPPW082DF3PMSP` (100k+ USDA)
- **STX Holder**: `SP1TXBBKYYCP3YVK2MH1PMWR7N0H2CYTKVAYH8YG4`
- **Real mainnet addresses** for comprehensive testing

## Simulation Results Analysis

The current simulation shows:

- 92 successful steps
- Complete campaign workflow
- Proper payment distribution
- All major functions working correctly
- Ready for time-dependent testing in Clarinet

## Next Steps

1. Update Clarinet tests to match STXER setup
2. Add comprehensive time-dependent test cases
3. Test all decision tree branches
4. Validate edge cases and error conditions
5. Ensure complete test coverage

## Known Issues

- STXER oracle decision testing is limited due to timing constraints
- Some edge cases can only be tested in Clarinet
- Need to maintain consistency between both test environments
