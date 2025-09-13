You're right, I see the issue - some sections weren't properly updated. Here's the corrected README in plain text:

```markdown
# FakFun T-Shirt Pre-Order Contract

A trustless crowdfunded pre-order system for limited edition t-shirts on Stacks blockchain using USDA tokens.

## Overview

This smart contract enables artists to run bulk pre-orders for custom t-shirts with escrow functionality and a fair dispute resolution system. Buyers pay upfront, funds are held in escrow, and payments are released based on delivery satisfaction ratings.

## Key Features

- **21 t-shirt minimum order target**
- **50 USDA per shirt** (45 USDA to artist/buyer + 5 USDA platform fee)
- **Three-tier satisfaction system** (100%, 50%, 0%)
- **Automatic dispute resolution** with oracle fallback
- **Tight deadline protections** against timing abuse
- **Maximum 24-day delivery estimates**

## Contract Flow & Deadlines
```

Order Phase → Campaign Complete → Shipping Phase → Delivery & Rating → Resolution
| | | | |
| | [2 weeks max] [2x delivery time] [0.5x delivery time]
| | | | |
v v v v v
Orders 1-21 21 Orders Artist Ships Buyer Rates Final Payment
Complete Items Delivery

```

### Complete Use Case Tree

```

👤 Buyer calls place-order(size) + pays 50 USDA
│
├─ 🎨 Artist NEVER ships (after 2 weeks from campaign completion)
│ └─ 👤 Buyer calls claim-never-shipped() → 45 USDA refund + 5 USDA fee to oracle
│
└─ 🎨 Artist calls mark-shipped(buyer, delivery-days) [within 2 weeks, max 24 days delivery]
│
├─ 👤 Buyer NEVER rates (after 2x delivery-days from shipped-block)
│ └─ 🎨 Artist calls claim-never-rated() → 45 USDA to artist + 5 USDA fee to oracle
│
└─ 👤 Buyer calls buyer-rates-delivery(rating)
│
├─ 👤 Buyer rates 100% (Satisfied)
│ └─ ⚡ INSTANT: 45 USDA to artist + 5 USDA fee to oracle
│
├─ 👤 Buyer rates 50% (Partially Satisfied)
│ ├─ 🎨 Artist calls artist-respond(buyer, true) → 22.5 USDA to artist, 22.5 USDA refund to buyer + 5 USDA fee
│ ├─ 🎨 Artist calls artist-respond(buyer, false)
│ │ └─ ⏰ After 0.5x delivery-days from rated-block
│ │ └─ 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
│ └─ 🎨 Artist NEVER responds (after 0.5x delivery-days from rated-block)
│ └─ 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
│
└─ 👤 Buyer rates 0% (Unsatisfied)
├─ 🎨 Artist calls artist-respond(buyer, true) → 45 USDA refund to buyer + 5 USDA fee to oracle
├─ 🎨 Artist calls artist-respond(buyer, false)
│ └─ ⏰ After 0.5x delivery-days from rated-block
│ └─ 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
└─ 🎨 Artist NEVER responds (after 0.5x delivery-days from rated-block)
└─ 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%

```

## Key Deadlines

| Deadline | From | Duration | Who Can Act | Action |
|----------|------|----------|-------------|---------|
| **Shipping Deadline** | Campaign completion | 2 weeks | Artist | Must `mark-shipped()` before deadline |
| **Never-Shipped Recoup** | Campaign completion | 2 weeks | Buyer | `claim-never-shipped()` |
| **Rating Deadline** | Item shipped | 2x delivery days | Artist | `claim-never-rated()` |
| **Artist Response Deadline** | Buyer rated | 0.5x delivery days | Oracle | `oracle-decide()` |

## Functions

### User Functions
- `place-order(size)` - Order a t-shirt and pay 50 USDA
- `buyer-rates-delivery(rating)` - Rate delivery satisfaction (0, 50, or 100)
- `claim-never-shipped(buyer)` - Get refund if artist never ships within 2 weeks

### Artist Functions
- `mark-shipped(buyer, delivery-days)` - Confirm shipment with estimated delivery time (max 24 days, within 2 weeks of completion)
- `artist-respond(buyer, agrees)` - Agree or disagree with buyer's rating
- `claim-never-rated(buyer)` - Claim payment if buyer never rates

### Oracle Functions
- `oracle-decide(buyer, final-rating)` - Make final decision on disputed ratings
- `set-artist(new-artist)` - Set the artist address

## Payment Distribution

**100% Satisfaction:** 45 USDA → Artist, 5 USDA → Oracle
**50% Satisfaction:** 22.5 USDA → Artist, 22.5 USDA → Buyer, 5 USDA → Oracle
**0% Satisfaction:** 45 USDA → Buyer, 5 USDA → Oracle

## Valid Sizes

XS, S, M, L, XL, XXL

## Error Codes

- `u100` - Unauthorized
- `u101` - Already ordered
- `u102` - Campaign full
- `u103` - Not shipped
- `u104` - Already rated
- `u105` - Invalid size
- `u106` - No order found
- `u107` - Already shipped
- `u108` - Invalid rating
- `u109` - Not rated
- `u110` - Not a valid rating
- `u111` - Deadline not met
- `u112` - Shipping too slow (>24 days)

## Security Features

- **Escrow protection** - Funds held until delivery confirmed
- **Time-based fallbacks** - Prevents indefinite fund lockup
- **Oracle dispute resolution** - Handles disagreements fairly
- **Authorization checks** - Only authorized parties can call specific functions
- **Multiple exit conditions** - Various ways to resolve stalled transactions
- **Timing abuse prevention** - Strict deadlines prevent gaming the system
```

Now all sections correctly reflect the 2-week deadline and include the new error code for shipping too slow.
