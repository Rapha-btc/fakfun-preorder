import { SimulationBuilder } from "stxer";
import fs from "node:fs";
import {
  contractPrincipalCV,
  uintCV,
  principalCV,
  stringAsciiCV,
  noneCV,
  ClarityVersion,
  boolCV,
} from "@stacks/transactions";

async function simulateTShirtPreOrderContract() {
  // Your contract (assuming deployed on mainnet)
  const TSHIRT_CONTRACT =
    "SP2HH7PR5SENEXCGDHSHGS5RFPMACEDRN5E4R0JRM.t-shirt-faktory";

  // USDA token contract
  const USDA_CONTRACT = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token";
  const USDA_HOLDER = "SP3JYMPETBPP4083YFDKF9DP9Y2CPPW082DF3PMSP"; // Address with USDA

  // Test addresses from your arrays
  const ORACLE = "SP2HH7PR5SENEXCGDHSHGS5RFPMACEDRN5E4R0JRM"; //"SP2P5A2F3VN7G7CSF3W68AHYZ6ZM6BJSZV69MG03J"; // Acts as deployer/oracle
  const ARTIST = "SP1QJ6SJWKHH54NJ8AZ48HJQ3MB036XHQKMCKQFMK";
  const BUYER1 = "SM2FXSN6RZ85Q18S3X0GE2N0FVAA1DN1DPPDXEB5X";
  const BUYER2 = "SP1Q1SHSTGQ7HT0CTXF1714NH1RFRZTXBSM4H7CX";
  const BUYER3 = "SP1YW0GTZHM2NG7G8TBCW00A7MABZE1YP9EZ1G2YQ";

  // Additional buyers for campaign completion (18 more needed for 21 total)
  const ADDITIONAL_BUYERS = [
    "SP2C2H1T2HJAJ0ZH3FFK3S2BVZVRHM111KJJXBTJT",
    "SP3PTAQA7VX2MC54YE9AP7MSSRBE4DZ1XH84V8ZS9",
    "SPQRZQWAZ78SE0Y9R571AGTK9V4GT9CWAFAQRNDK",
    "SP919TMG926VPZFC380XNMZPXGDXWWDQXGTCNM49",
    "SP3M0W9Z02DE5WQB9BC6B7GA1MYSXJYQFG43WZVYA",
    "SP232FSXX7AQ91HJSPHSEHBJARJTMGFMN07Z5A63Q",
    "SPC4KV219DVR26BFGJY6GB8W3MCQC4076VZ6TVP2",
    "SP1KVFYWFJ34JPXBA431EPGMGG9QFQ52CAS01CE7F",
    "SP1NN7EPM92359QHBP5KQTDZHQ86TR0NN8QY2ZBVS",
    "SP214EJCRHFF0Y1941FDKQP2J0GBQPG6RKSKHTCVQ",
    "SP329PX4GGC1807FBK7T35GWM06FC0FVS4HWA6KJD",
    "SPW1SGXZKGAVFEH4XTWEK374AQ0CAB7G7QH4PVFM",
    "SP3YM5YRTKHTWRC82K5DZJBY9XW0K4AX0P9PM5VSH",
    "SPSC35NSP4BMQNYDAFQBEGV13ZP4YBS41WASJ0E2",
    "SP2TTVRSPJX5QXMAPRXJAYFWGEZ5PSS6A19G5KFES",
    "SP3CE9CTYTNYQVWZ79K4VXEFWB7NS25NKRCB3ANTM",
    "SP7SHEREY1MWFRGB2WB3QQMBP4HJ9AJ8Q9ZB1YJM",
    "SP3RKM375AZAJR4WYCCEVMDB4DZEZMFF06C0XHB5P",
  ];

  const STX_HOLDER = "SP1TXBBKYYCP3YVK2MH1PMWR7N0H2CYTKVAYH8YG4";

  const simulation = SimulationBuilder.new()
    .withSender(ORACLE)

    // ===== PHASE 0: CONTRACT DEPLOYMENT =====

    // Deploy the t-shirt-faktory contract first
    .addContractDeploy({
      contract_name: "t-shirt-faktory",
      source_code: fs.readFileSync("./contracts/t-shirt-faktory.clar", "utf8"),
      clarity_version: ClarityVersion.Clarity3,
    })

    // ===== PHASE 1: CONTRACT SETUP =====

    // STX funding address

    // Fund all accounts with STX for gas fees (100 STX each)
    .addSTXTransfer({
      recipient: ORACLE,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ARTIST,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: BUYER1,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: BUYER2,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: BUYER3,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: USDA_HOLDER,
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[0],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[1],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[2],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[3],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[4],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[5],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[6],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[7],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[8],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[9],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[10],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[11],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[12],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[13],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[14],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[15],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[16],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: ADDITIONAL_BUYERS[17],
      amount: 1000000,
      sender: STX_HOLDER,
    })
    .addSTXTransfer({
      recipient: "SP2FXSN6RZ85Q18S3X0GE2N0FVAA1DN1DPMT9TX6E",
      amount: 1000000,
      sender: STX_HOLDER,
    })

    // Fund test accounts with USDA (1000 USDA each = 1000000000 micro-USDA)
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ORACLE),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ARTIST),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(1000000000), // 1000 USDA
        principalCV(USDA_HOLDER),
        principalCV(BUYER1),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(1000000000), // 1000 USDA
        principalCV(USDA_HOLDER),
        principalCV(BUYER2),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(1000000000), // 1000 USDA
        principalCV(USDA_HOLDER),
        principalCV(BUYER3),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })

    // Fund additional buyers with USDA (100 USDA each = 100000000 micro-USDA)
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[0]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[1]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[2]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })

    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[3]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[4]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[5]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[6]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[7]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[8]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[9]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[10]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[11]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[12]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[13]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[14]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[15]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[16]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "transfer",
      function_args: [
        uintCV(100000000), // 100 USDA
        principalCV(USDA_HOLDER),
        principalCV(ADDITIONAL_BUYERS[17]),
        noneCV(),
      ],
      sender: USDA_HOLDER,
    })

    // Set artist in contract
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "set-artist",
      function_args: [principalCV(ARTIST)],
      sender: ORACLE,
    })

    // ===== PHASE 2: CAMPAIGN SETUP & ORDER PLACEMENT =====

    // Test valid order placement
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")], // Large size
      sender: BUYER1,
    })

    // Test duplicate order prevention (should fail)
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")], // Different size, same buyer
      sender: BUYER1,
    })

    // Test invalid size rejection (should fail)
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("XYZ")], // Invalid size
      sender: BUYER2,
    })

    // Valid orders to build toward campaign completion
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")], // Medium size
      sender: BUYER2,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")], // Small size
      sender: BUYER3,
    })

    // Fill campaign to capacity (add 18 more orders to reach 21 total)
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[0],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[1],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[2],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[3],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[4],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[5],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[6],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[7],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[8],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[9],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[10],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[11],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[12],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[13],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[14],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ADDITIONAL_BUYERS[15],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("L")],
      sender: ADDITIONAL_BUYERS[16],
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("S")],
      sender: ADDITIONAL_BUYERS[17],
    })

    // Try to place 22nd order (should fail - campaign full)
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "place-order",
      function_args: [stringAsciiCV("M")],
      sender: ORACLE, // Oracle tries to place order but campaign is full
    })

    // ===== PHASE 3: SHIPPING & DELIVERY =====

    // Artist marks orders as shipped within deadline
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "mark-shipped",
      function_args: [
        principalCV(BUYER1),
        uintCV(7), // 7 days delivery estimate
      ],
      sender: ARTIST,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "mark-shipped",
      function_args: [
        principalCV(BUYER2),
        uintCV(10), // 10 days delivery estimate
      ],
      sender: ARTIST,
    })

    // Test rejection of excessive delivery estimate (should fail)
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "mark-shipped",
      function_args: [
        principalCV(BUYER3),
        uintCV(25), // 25 days > 24 max (should fail)
      ],
      sender: ARTIST,
    })

    // Correct the delivery estimate for BUYER3
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "mark-shipped",
      function_args: [
        principalCV(BUYER3),
        uintCV(14), // 14 days delivery estimate
      ],
      sender: ARTIST,
    })

    // ===== PHASE 4: RATING & PAYMENT SYSTEM =====

    // Test 100% rating with instant payout
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "buyer-rates-delivery",
      function_args: [uintCV(100)], // 100% satisfaction
      sender: BUYER1,
    })

    // Test 50% rating with artist agreement
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "buyer-rates-delivery",
      function_args: [uintCV(50)], // 50% satisfaction
      sender: BUYER2,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "artist-respond",
      function_args: [
        principalCV(BUYER2),
        boolCV(true), // Artist agrees to split (true)
      ],
      sender: ARTIST,
    })

    // Test 0% rating with artist disagreement leading to oracle decision
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "buyer-rates-delivery",
      function_args: [uintCV(0)], // 0% satisfaction
      sender: BUYER3,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "artist-respond",
      function_args: [
        principalCV(BUYER3),
        boolCV(false), // Artist disagrees (false)
      ],
      sender: ARTIST,
    })

    // Mine blocks to simulate time passing for oracle decision deadline
    // Note: In stxer, we can't mine blocks, so we assume oracle can decide immediately

    // Oracle decides on disputed rating
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "oracle-decide",
      function_args: [
        principalCV(BUYER3),
        uintCV(25), // Oracle decides 25% compromise
      ],
      sender: ORACLE,
    })

    // ===== PHASE 5: VERIFICATION =====

    // Check campaign status
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "get-campaign-status",
      function_args: [],
      sender: ORACLE,
    })

    // Check individual order statuses
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "get-order",
      function_args: [principalCV(BUYER1)],
      sender: ORACLE,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "get-order",
      function_args: [principalCV(BUYER2)],
      sender: ORACLE,
    })
    .addContractCall({
      contract_id: TSHIRT_CONTRACT,
      function_name: "get-order",
      function_args: [principalCV(BUYER3)],
      sender: ORACLE,
    })

    // Check final USDA balances
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "get-balance",
      function_args: [principalCV(ARTIST)],
      sender: ORACLE,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "get-balance",
      function_args: [principalCV(BUYER1)],
      sender: ORACLE,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "get-balance",
      function_args: [principalCV(BUYER2)],
      sender: ORACLE,
    })
    .addContractCall({
      contract_id: USDA_CONTRACT,
      function_name: "get-balance",
      function_args: [principalCV(BUYER3)],
      sender: ORACLE,
    });

  try {
    const simulationId = await simulation.run();
    console.log(`
===== T-SHIRT PRE-ORDER CONTRACT SIMULATION =====
Simulation URL: https://stxer.xyz/simulations/mainnet/${simulationId}

Expected Results:
- Phase 1: Contract setup with USDA funding and artist assignment
- Phase 2: 21 valid orders placed, campaign reaches capacity
- Phase 3: Artist ships orders with valid delivery estimates
- Phase 4: Various rating scenarios (100%, 50%, 0% with oracle decision)
- Phase 5: Final verification of balances and order statuses

This tests the complete t-shirt pre-order contract workflow with real mainnet addresses.
    `);
    return simulationId;
  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
}

// Run the simulation
simulateTShirtPreOrderContract().catch(console.error);

// Using block height 3486493 hash 0x0ba0d6a74ef6ea4e5ba9c9d7098a93ec9fbbb64df00b67f6d46ba0db985a5870 to run simulation.
// Simulation will be available at: https://stxer.xyz/simulations/mainnet/e795f71939b7dc797764d87ec0b8d182

// ===== T-SHIRT PRE-ORDER CONTRACT SIMULATION =====
// Simulation URL: https://stxer.xyz/simulations/mainnet/e795f71939b7dc797764d87ec0b8d182

// Expected Results:
// - Phase 1: Contract setup with USDA funding and artist assignment
// - Phase 2: 21 valid orders placed, campaign reaches capacity
// - Phase 3: Artist ships orders with valid delivery estimates
// - Phase 4: Various rating scenarios (100%, 50%, 0% with oracle decision)
// - Phase 5: Final verification of balances and order statuses

// This tests the complete t-shirt pre-order contract workflow with real mainnet addresses.
