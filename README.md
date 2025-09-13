# T-Shirt Order Contract

A smart contract system for managing t-shirt orders with built-in dispute resolution and timing protections.

## Key Features

- **Tight deadline protections** against timing abuse
- **Maximum 24-day delivery estimates**
- Automated dispute resolution through oracle system
- Buyer protection with refund mechanisms

## Contract Flow

The order process follows these phases:

1. **Order Phase** - Buyer places order and pays
2. **Campaign Complete** - Order collection period ends
3. **Shipping Phase** - Artist ships items
4. **Delivery & Rating** - Buyer receives and rates delivery
5. **Resolution** - Final payment distribution

## Timeline Limits

- Campaign to shipping: **2 weeks maximum**
- Delivery time: **2x estimated delivery days**
- Response time: **0.5x delivery days**

## Complete Decision Tree

```
Buyer calls place-order(size) + pays 50 USDA
│
├─ Artist NEVER ships (after 2 weeks from campaign completion)
│  └─ Buyer calls claim-never-shipped() → 45 USDA refund + 5 USDA fee to oracle
│
└─ Artist calls mark-shipped(buyer, delivery-days) [within 2 weeks, max 24 days delivery]
   │
   ├─ Buyer NEVER rates (after 2x delivery-days from shipped-block)
   │  └─ Artist calls claim-never-rated() → 45 USDA to artist + 5 USDA fee to oracle
   │
   └─ Buyer calls buyer-rates-delivery(rating)
      │
      ├─ Buyer rates 100% (Satisfied)
      │  └─ INSTANT: 45 USDA to artist + 5 USDA fee to oracle
      │
      ├─ Buyer rates 50% (Partially Satisfied)
      │  ├─ Artist calls artist-respond(buyer, true) → 22.5 USDA to artist, 22.5 USDA refund to buyer + 5 USDA fee
      │  ├─ Artist calls artist-respond(buyer, false)
      │  │  └─ After 0.5x delivery-days from rated-block
      │  │     └─ Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
      │  └─ Artist NEVER responds (after 0.5x delivery-days from rated-block)
      │     └─ Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
      │
      └─ Buyer rates 0% (Unsatisfied)
         ├─ Artist calls artist-respond(buyer, true) → 45 USDA refund to buyer + 5 USDA fee to oracle
         ├─ Artist calls artist-respond(buyer, false)
         │  └─ After 0.5x delivery-days from rated-block
         │     └─ Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
         └─ Artist NEVER responds (after 0.5x delivery-days from rated-block)
            └─ Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100%
```

## Use Cases Summary

### Campaign Never Completes

- Multiple buyers place orders but total stays below 21
- After 3 weeks, oracle calls refund function
- **Result**: All buyers get full 50 USDA refund

### Successful Delivery (100% Rating)

- Buyer pays 50 USDA → Artist ships → Buyer rates 100%
- **Result**: 45 USDA to artist + 5 USDA oracle fee

### Partial Satisfaction (50% Rating)

- Buyer pays 50 USDA → Artist ships → Buyer rates 50%
- Artist can accept (split payment) or dispute (oracle decides)

### No Satisfaction (0% Rating)

- Buyer pays 50 USDA → Artist ships → Buyer rates 0%
- Artist can accept refund or dispute (oracle decides)

### Artist Never Ships

- Buyer pays 50 USDA → Artist fails to ship within 2 weeks
- **Result**: 45 USDA refund to buyer + 5 USDA oracle fee

### Buyer Never Rates

- Buyer pays 50 USDA → Artist ships → Buyer never rates
- **Result**: 45 USDA to artist + 5 USDA oracle fee

## Key Deadlines

| Event           | Trigger           | Duration           | Action Required     |
| --------------- | ----------------- | ------------------ | ------------------- |
| Shipping        | Campaign complete | 2 weeks            | Artist must ship    |
| Rating          | Item shipped      | 2x delivery days   | Buyer must rate     |
| Response        | Buyer rated       | 0.5x delivery days | Artist must respond |
| Oracle Decision | No response       | 0.5x delivery days | Oracle decides      |

## Functions

### Buyer Functions

- `place-order(size)` - Order item and pay 50 USDA
- `buyer-rates-delivery(rating)` - Rate satisfaction (0, 50, or 100)
- `claim-never-shipped(buyer)` - Get refund if not shipped

### Artist Functions

- `mark-shipped(buyer, delivery-days)` - Confirm shipment
- `claim-never-rated()` - Claim payment if buyer doesn't rate
- `artist-respond(buyer, accepts)` - Respond to partial/no satisfaction

### Oracle Functions

- `oracle-decide(buyer, final-rating)` - Make final rating decision

## Payment Structure

- **Order amount**: 50 USDA
- **Oracle fee**: 5 USDA (always paid)
- **Disputed amount**: 45 USDA (distributed based on resolution)

## Protection Mechanisms

1. **Time limits** prevent indefinite disputes
2. **Oracle intervention** resolves deadlocks
3. **Automatic refunds** for artist non-compliance
4. **Rating system** ensures quality incentives
