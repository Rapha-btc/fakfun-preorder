# README

**Tight deadline protections** against timing abuse
**Maximum 24-day delivery estimates**

## Contract Flow & Deadlines

Order Phase → Campaign Complete → Shipping Phase → Delivery & Rating → Resolution | | | | | |
| [2 weeks max] [2x delivery time] [0.5x delivery time] | | | | | v v v v v Orders 1-21 21 Orders
Artist Ships Buyer Rates Final Payment Complete Items Delivery

### Complete Use Case Tree

🧑 Buyer calls place-order(size) + pays 50 USDA | |—— 🎨 Artist NEVER ships (after 2 weeks
from campaign completion) | |—— 🧑 Buyer calls claim-never-shipped() → 45 USDA refund + 5
USDA fee to oracle | |—— 🎨 Artist calls mark-shipped(buyer, delivery-days) [within 2 weeks,
max 24 days delivery] | |—— 🧑 Buyer NEVER rates (after 2x delivery-days from shipped-block) |
|—— 🎨 Artist calls claim-never-rated() → 45 USDA to artist + 5 USDA fee to oracle | |—— 🧑
Buyer calls buyer-rates-delivery(rating) | |—— 🧑 Buyer rates 100% (Satisfied) | |—— ⚡ INSTANT:
45 USDA to artist + 5 USDA fee to oracle | |—— 🧑 Buyer rates 50% (Partially Satisfied) | |—— 🎨
Artist calls artist-respond(buyer, true) → 22.5 USDA to artist, 22.5 USDA refund to buyer + 5
USDA fee | |—— 🎨 Artist calls artist-respond(buyer, false) | | |—— 🔮 After 0.5x delivery-days
from rated-block | | |—— 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%,
or 100% | |—— 🎨 Artist NEVER responds (after 0.5x delivery-days from rated-block) | |—— 🔮
Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or 100% | |—— 🧑 Buyer
rates 0% (Unsatisfied) |—— 🎨 Artist calls artist-respond(buyer, true) → 45 USDA refund to
buyer + 5 USDA fee to oracle |—— 🎨 Artist calls artist-respond(buyer, false) | |—— 🔮 After 0.5x
delivery-days from rated-block | |—— 🧑 Oracle calls oracle-decide(buyer, final-rating) →
Chooses 0%, 50%, or 100% |—— 🎨 Artist NEVER responds (after 0.5x delivery-days from
rated-block) |—— 🔮 Oracle calls oracle-decide(buyer, final-rating) → Chooses 0%, 50%, or
100%

## Key Deadlines

| Deadline                     | From                | Duration           | Who Can Act | Action                  |
| ---------------------------- | ------------------- | ------------------ | ----------- | ----------------------- |
| **Shipping Deadline**        | Campaign completion | 2 weeks            | Artist      | Must `mark-shipped()`   |
| **Never-Shipped Recoup**     | Campaign completion | 2 weeks            | Buyer       | `claim-never-shipped()` |
| **Rating Deadline**          | Item shipped        | 2x delivery days   | Artist      | `claim-never-rated()`   |
| **Artist Response Deadline** | Buyer rated         | 0.5x delivery days | Oracle      | `oracle-decide()`       |

## Functions

### User Functions

- `place-order(size)` - Order a t-shirt and pay 50 USDA
- `buyer-rates-delivery(rating)` - Rate delivery satisfaction (0, 50, or 100)
- `claim-never-shipped(buyer)` - Get refund if artist never ships within 2 weeks

### Artist Functions

- `mark-shipped(buyer, delivery-days)` - Confirm shipment with estimated delivery time
