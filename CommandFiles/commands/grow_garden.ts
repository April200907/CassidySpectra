import { Collectibles, Inventory } from "@cass-modules/InventoryEnhanced";
import { UNIRedux, UNISpectra } from "../modules/unisym.js";
import { SpectralCMDHome } from "@cassidy/spectral-home";
import { InventoryItem, UserStatsManager } from "@cass-modules/cassidyUser";
import {
  formatCash,
  formatTimeSentence,
  formatValue,
  parseBet,
} from "@cass-modules/ArielUtils";
import OutputProps from "output-cassidy";
import InputClass from "@cass-modules/InputClass";

export const meta: CassidySpectra.CommandMeta = {
  name: "garden",
  description: "Grow crops and earn Money in your garden!",
  otherNames: ["grow", "growgarden", "gr", "g", "gag"],
  version: "1.3.9",
  usage: "{prefix}{name} [subcommand]",
  category: "Idle Investment Games",
  author: "Liane Cagara 🎀",
  permissions: [0],
  noPrefix: "both",
  waitingTime: 1,
  requirement: "3.0.0",
  icon: "🌱",
  cmdType: "cplx_g",
};

export const PLOT_LIMIT = 36;
export const PLOT_EXPANSION_LIMIT = 56;
export const PET_LIMIT = 60;
export const PET_EQUIP_LIMIT = 8;
export const ITEMS_PER_PAGE = 6;

const EVENT_CONFIG = {
  WEEKLY_CYCLE: 7 * 24 * 60 * 60 * 1000,
  WEATHER_CYCLE: 1 * 60 * 60 * 1000,
  EVENT_CYCLE: 4 * 60 * 60 * 1000,
  EVENTS: [
    {
      name: "No Event",
      icon: "🌱",
      isNoEvent: true,
      effect: {},
      shopItems: [],
    },
    {
      name: "Frost",
      icon: "❄️",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 0.9,
        mutationType: "Chilled",
      },
      shopItems: [],
    },
    {
      name: "Thunderstorm",
      icon: "⛈️",
      effect: {
        mutationChance: 0.25,
        growthMultiplier: 1.5,
        mutationType: "Shocked",
      },
      shopItems: [
        {
          icon: "🪷",
          name: "Lotus Seed",
          key: "gsLotus",
          flavorText: "A rare seed available during Thunderstorm!",
          price: 500,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsLotus",
              name: "Lotus Seed",
              flavorText: "A rare seed from Thunderstorm.",
              icon: "🪷",
              type: "gardenSeed",
              sellPrice: 250,
              cropData: {
                baseValue: 1000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
      ],
    },

    {
      name: "Easter Event 2025",
      icon: "🐣",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 1.2,
        mutationType: "Chocolate",
      },
      shopItems: [
        {
          icon: "🍫",
          name: "Chocolate Carrot Seed",
          key: "gsChocoCarrot",
          flavorText: "A sweet carrot from the Easter Event!",
          price: 200,
          rarity: "Common",
          stockChance: 1.0,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsChocoCarrot",
              name: "Chocolate Carrot Seed",
              flavorText: "A sweet carrot from the Easter Event.",
              icon: "🍫",
              type: "gardenSeed",
              sellPrice: 100,
              cropData: {
                baseValue: 400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 1.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍭",
          name: "Red Lollipop Seed",
          key: "gsRedLollipop",
          flavorText: "A sugary treat from the Easter Event.",
          price: 500,
          rarity: "Uncommon",
          stockChance: 0.8,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsRedLollipop",
              name: "Red Lollipop Seed",
              flavorText: "A sugary treat from the Easter Event.",
              icon: "🍭",
              type: "gardenSeed",
              sellPrice: 250,
              cropData: {
                baseValue: 1000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌻",
          name: "Candy Sunflower Seed",
          key: "gsCandySunflower",
          flavorText: "A radiant flower from the Easter Event.",
          price: 1200,
          rarity: "Rare",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCandySunflower",
              name: "Candy Sunflower Seed",
              flavorText: "A radiant flower from the Easter Event.",
              icon: "🌻",
              type: "gardenSeed",
              sellPrice: 600,
              cropData: {
                baseValue: 2400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥚",
          name: "Easter Egg Seed",
          key: "gsEasterEgg",
          flavorText: "A festive egg from the Easter Event.",
          price: 3000,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsEasterEgg",
              name: "Easter Egg Seed",
              flavorText: "A festive egg from the Easter Event.",
              icon: "🥚",
              type: "gardenSeed",
              sellPrice: 1500,
              cropData: {
                baseValue: 6000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🌸",
          name: "Candy Blossom Seed",
          key: "gsCandyBlossom",
          flavorText: "A divine bloom from the Easter Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCandyBlossom",
              name: "Candy Blossom Seed",
              flavorText: "A divine bloom from the Easter Event.",
              icon: "🌸",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍫💦",
          name: "Chocolate Sprinkler",
          key: "gtChocoSprinkler",
          flavorText: "Boosts Chocolate mutations for Easter crops.",
          price: 1000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtChocoSprinkler",
              name: "Chocolate Sprinkler",
              flavorText: "Boosts Chocolate mutations for Easter crops.",
              icon: "🍫💦",
              type: "gardenTool",
              sellPrice: 500,
              toolData: {
                growthMultiplier: 1.2,
                mutationChance: { Chocolate: 0.3 },
              },
            });
          },
        },
      ],
    },
    {
      name: "Angry Plant Event",
      icon: "🌿😣",
      effect: {
        mutationChance: 0.25,
        growthMultiplier: 1.1,
        mutationType: "Angry",
      },
      shopItems: [
        {
          icon: "🍒",
          name: "Cranberry Seed",
          key: "gsCranberry",
          flavorText: "A tart fruit from the Angry Plant Event.",
          price: 3500,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCranberry",
              name: "Cranberry Seed",
              flavorText: "A tart fruit from the Angry Plant Event.",
              icon: "🍒",
              type: "gardenSeed",
              sellPrice: 1750,
              cropData: {
                baseValue: 7000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥭",
          name: "Durian Seed",
          key: "gsDurian",
          flavorText: "A pungent fruit from the Angry Plant Event.",
          price: 4000,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsDurian",
              name: "Durian Seed",
              flavorText: "A pungent fruit from the Angry Plant Event.",
              icon: "🥭",
              type: "gardenSeed",
              sellPrice: 2000,
              cropData: {
                baseValue: 8000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍆",
          name: "Eggplant Seed",
          key: "gsEggplant",
          flavorText: "A versatile veggie from the Angry Plant Event.",
          price: 5000,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsEggplant",
              name: "Eggplant Seed",
              flavorText: "A versatile veggie from the Angry Plant Event.",
              icon: "🍆",
              type: "gardenSeed",
              sellPrice: 2500,
              cropData: {
                baseValue: 10000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🪷",
          name: "Lotus Seed",
          key: "gsLotus",
          flavorText: "A serene flower from the Angry Plant Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsLotus",
              name: "Lotus Seed",
              flavorText: "A serene flower from the Angry Plant Event.",
              icon: "🪷",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🪴",
          name: "Venus Fly Trap Seed",
          key: "gsVenusFlyTrap",
          flavorText: "A carnivorous plant from the Angry Plant Event.",
          price: 6500,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsVenusFlyTrap",
              name: "Venus Fly Trap Seed",
              flavorText: "A carnivorous plant from the Angry Plant Event.",
              icon: "🪴",
              type: "gardenSeed",
              sellPrice: 3250,
              cropData: {
                baseValue: 13000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 1,
              },
            });
          },
        },
        // {
        //   icon: "🌱",
        //   name: "Basic Seed Pack",
        //   key: "gtBasicSeedPack",
        //   flavorText: "A pack of basic seeds from the Angry Plant Event.",
        //   price: 500,
        //   rarity: "Common",
        //   stockChance: 0.8,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtBasicSeedPack",
        //       name: "Basic Seed Pack",
        //       flavorText: "A pack of basic seeds from the Angry Plant Event.",
        //       icon: "🌱",
        //       type: "gardenTool",
        //       sellPrice: 250,
        //       toolData: {
        //         seedTypes: ["gsCarrot", "gsStrawberry", "gsBlueberry"],
        //       },
        //     });
        //   },
        // },
        // {
        //   icon: "🌟",
        //   name: "Premium Seed Pack",
        //   key: "gtPremiumSeedPack",
        //   flavorText:
        //     "A pack of premium seeds with a chance for rainbow sacks.",
        //   price: 1500,
        //   rarity: "Rare",
        //   stockChance: 0.4,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtPremiumSeedPack",
        //       name: "Premium Seed Pack",
        //       flavorText:
        //         "A pack of premium seeds with a chance for rainbow sacks.",
        //       icon: "🌟",
        //       type: "gardenTool",
        //       sellPrice: 750,
        //       toolData: {
        //         seedTypes: ["gsTomato", "gsWatermelon", "gsOrangeTulip"],
        //       },
        //     });
        //   },
        // },
      ],
    },
    {
      name: "Lunar Glow Event",
      icon: "🌙",
      effect: {
        mutationChance: 0.3,
        growthMultiplier: 1.3,
        mutationType: "Moonlit",
      },
      shopItems: [
        {
          icon: "🌙",
          name: "Moonflower Seed",
          key: "gsMoonflower",
          flavorText: "Rare flower blooming under moonlight.",
          price: 8000,
          rarity: "Legendary",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonflower",
              name: "Moonflower Seed",
              flavorText: "Rare flower blooming under moonlight.",
              icon: "🌙",
              type: "gardenSeed",
              sellPrice: 4000,
              cropData: {
                baseValue: 16000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍃",
          name: "Mint Seed",
          key: "gsMint",
          flavorText: "Refreshing herb with culinary uses.",
          price: 2200,
          rarity: "Rare",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMint",
              name: "Mint Seed",
              flavorText: "Refreshing herb with culinary uses.",
              icon: "🍃",
              type: "gardenSeed",
              sellPrice: 1100,
              cropData: {
                baseValue: 4400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 2,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍄",
          name: "Glowshroom Seed",
          key: "gsGlowshroom",
          flavorText: "Bioluminescent mushroom with unique glow.",
          price: 3000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsGlowshroom",
              name: "Glowshroom Seed",
              flavorText: "Bioluminescent mushroom with unique glow.",
              icon: "🍄",
              type: "gardenSeed",
              sellPrice: 1500,
              cropData: {
                baseValue: 6000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌟",
          name: "Starfruit Seed",
          key: "gsStarfruit",
          flavorText: "A radiant fruit from the Lunar Glow Event.",
          price: 3500,
          rarity: "Legendary",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsStarfruit",
              name: "Starfruit Seed",
              flavorText: "A radiant fruit from the Lunar Glow Event.",
              icon: "🌟",
              type: "gardenSeed",
              sellPrice: 1750,
              cropData: {
                baseValue: 7000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌼",
          name: "Moonglow Seed",
          key: "gsMoonglow",
          flavorText: "A glowing flower from the Lunar Glow Event.",
          price: 4000,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonglow",
              name: "Moonglow Seed",
              flavorText: "A glowing flower from the Lunar Glow Event.",
              icon: "🌼",
              type: "gardenSeed",
              sellPrice: 2000,
              cropData: {
                baseValue: 8000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌸",
          name: "Moon Blossom Seed",
          key: "gsMoonBlossom",
          flavorText: "A divine bloom from the Lunar Glow Event.",
          price: 6000,
          rarity: "Divine",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonBlossom",
              name: "Moon Blossom Seed",
              flavorText: "A divine bloom from the Lunar Glow Event.",
              icon: "🌸",
              type: "gardenSeed",
              sellPrice: 3000,
              cropData: {
                baseValue: 12000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🍌",
          name: "Blood Banana Seed",
          key: "gsBloodBanana",
          flavorText: "A rare fruit from the Lunar Glow Event.",
          price: 5500,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsBloodBanana",
              name: "Blood Banana Seed",
              flavorText: "A rare fruit from the Lunar Glow Event.",
              icon: "🍌",
              type: "gardenSeed",
              sellPrice: 2750,
              cropData: {
                baseValue: 11000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🍈",
          name: "Moon Melon Seed",
          key: "gsMoonMelon",
          flavorText: "A juicy melon from the Lunar Glow Event.",
          price: 5200,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonMelon",
              name: "Moon Melon Seed",
              flavorText: "A juicy melon from the Lunar Glow Event.",
              icon: "🍈",
              type: "gardenSeed",
              sellPrice: 2600,
              cropData: {
                baseValue: 10400,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 1,
              },
            });
          },
        },
        {
          icon: "🫐",
          name: "Celestiberry Seed",
          key: "gsCelestiberry",
          flavorText: "A celestial berry from the Lunar Glow Event.",
          price: 5000,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsCelestiberry",
              name: "Celestiberry Seed",
              flavorText: "A celestial berry from the Lunar Glow Event.",
              icon: "🫐",
              type: "gardenSeed",
              sellPrice: 2500,
              cropData: {
                baseValue: 10000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🥭",
          name: "Moon Mango Seed",
          key: "gsMoonMango",
          flavorText: "A tropical fruit from the Lunar Glow Event.",
          price: 5500,
          rarity: "Mythical",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsMoonMango",
              name: "Moon Mango Seed",
              flavorText: "A tropical fruit from the Lunar Glow Event.",
              icon: "🥭",
              type: "gardenSeed",
              sellPrice: 2750,
              cropData: {
                baseValue: 11000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🌑",
          name: "Nightshade Seed",
          key: "gsNightshade",
          flavorText: "A mysterious crop from the Lunar Glow Event.",
          price: 4500,
          rarity: "Legendary",
          stockChance: 0.25,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsNightshade",
              name: "Nightshade Seed",
              flavorText: "A mysterious crop from the Lunar Glow Event.",
              icon: "🌑",
              type: "gardenSeed",
              sellPrice: 2250,
              cropData: {
                baseValue: 9000,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
                harvests: 2,
              },
            });
          },
        },
        {
          icon: "🦔",
          name: "Hedgehog",
          key: "gpHedgehog",
          flavorText: "A spiky pet from the Lunar Glow Event.",
          price: 2000000,
          rarity: "Uncommon",
          stockChance: 0.6,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpHedgehog",
              name: "Hedgehog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦔",
              type: "gardenPetCage",
              sellPrice: 1000000,
              petData: {
                name: "Hedgehog",
                collectionRate: 0.1,
                seedTypes: ["gsMoonflower", "gsMint", "gsGlowshroom"],
              },
            });
          },
        },
        {
          icon: "🐹",
          name: "Mole",
          key: "gpMole",
          flavorText: "A digging pet from the Lunar Glow Event.",
          price: 2500000,
          rarity: "Uncommon",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpMole",
              name: "Mole",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐹",
              type: "gardenPetCage",
              sellPrice: 1250000,
              petData: {
                name: "Mole",
                collectionRate: 0.1,
                seedTypes: ["gsStarfruit", "gsMoonglow", "gsNightshade"],
              },
            });
          },
        },
        {
          icon: "🐸",
          name: "Frog",
          key: "gpFrog",
          flavorText: "A hopping pet from the Lunar Glow Event.",
          price: 2000000,
          rarity: "Uncommon",
          stockChance: 0.6,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpFrog",
              name: "Frog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐸",
              type: "gardenPetCage",
              sellPrice: 1000000,
              petData: {
                name: "Frog",
                collectionRate: 0.1,
                seedTypes: ["gsMoonBlossom", "gsBloodBanana", "gsMoonMelon"],
              },
            });
          },
        },
        {
          icon: "🐸🌙",
          name: "Echo Frog",
          key: "gpEchoFrog",
          flavorText: "A mystical frog from the Lunar Glow Event.",
          price: 3000000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpEchoFrog",
              name: "Echo Frog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐸🌙",
              type: "gardenPetCage",
              sellPrice: 1500000,
              petData: {
                name: "Echo Frog",
                collectionRate: 0.15,
                seedTypes: ["gsCelestiberry", "gsMoonMango"],
              },
            });
          },
        },
        {
          icon: "🦇",
          name: "Night Owl",
          key: "gpNightOwl",
          flavorText: "A nocturnal pet from the Lunar Glow Event.",
          price: 3500000,
          rarity: "Rare",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpNightOwl",
              name: "Night Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦇",
              type: "gardenPetCage",
              sellPrice: 1750000,
              petData: {
                name: "Night Owl",
                collectionRate: 0.15,
                seedTypes: ["gsMoonflower", "gsMoonglow", "gsMoonBlossom"],
              },
            });
          },
        },
        {
          icon: "🦝",
          name: "Raccoon",
          key: "gpRaccoon",
          flavorText: "A sneaky pet from the Lunar Glow Event.",
          price: 3000000,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpRaccoon",
              name: "Raccoon",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦝",
              type: "gardenPetCage",
              sellPrice: 1500000,
              petData: {
                name: "Raccoon",
                collectionRate: 0.15,
                seedTypes: ["gsBloodBanana", "gsMoonMelon", "gsCelestiberry"],
              },
            });
          },
        },
        {
          icon: "🥝",
          name: "Kiwi",
          key: "gpKiwi",
          flavorText: "A fuzzy pet from the Lunar Glow Event.",
          price: 4000000,
          rarity: "Legendary",
          stockChance: 0.2,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpKiwi",
              name: "Kiwi",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🥝",
              type: "gardenPetCage",
              sellPrice: 2000000,
              petData: {
                name: "Kiwi",
                collectionRate: 0.2,
                seedTypes: ["gsMoonMango", "gsNightshade"],
              },
            });
          },
        },
        {
          icon: "🦉",
          name: "Owl",
          key: "gpOwl",
          flavorText: "A wise pet from the Lunar Glow Event.",
          price: 5000000,
          rarity: "Legendary",
          stockChance: 0.15,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpOwl",
              name: "Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦉",
              type: "gardenPetCage",
              sellPrice: 2500000,
              petData: {
                name: "Owl",
                collectionRate: 0.2,
                seedTypes: ["gsMoonflower", "gsStarfruit", "gsMoonglow"],
              },
            });
          },
        },
        {
          icon: "🥝🌑",
          name: "Blood Kiwi",
          key: "gpBloodKiwi",
          flavorText: "A rare pet from the Lunar Glow Event.",
          price: 6000000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodKiwi",
              name: "Blood Kiwi",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🥝🌑",
              type: "gardenPetCage",
              sellPrice: 3000000,
              petData: {
                name: "Blood Kiwi",
                collectionRate: 0.25,
                seedTypes: ["gsBloodBanana", "gsMoonMelon"],
              },
            });
          },
        },
        {
          icon: "🦔🌑",
          name: "Blood Hedgehog",
          key: "gpBloodHedgehog",
          flavorText: "A fierce pet from the Lunar Glow Event.",
          price: 6000000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodHedgehog",
              name: "Blood Hedgehog",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦔🌑",
              type: "gardenPetCage",
              sellPrice: 3000000,
              petData: {
                name: "Blood Hedgehog",
                collectionRate: 0.25,
                seedTypes: ["gsCelestiberry", "gsMoonMango"],
              },
            });
          },
        },
        {
          icon: "🦉🌑",
          name: "Blood Owl",
          key: "gpBloodOwl",
          flavorText: "A mystical pet from the Lunar Glow Event.",
          price: 6500000,
          rarity: "Mythical",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpBloodOwl",
              name: "Blood Owl",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🦉🌑",
              type: "gardenPetCage",
              sellPrice: 3250000,
              petData: {
                name: "Blood Owl",
                collectionRate: 0.25,
                seedTypes: ["gsMoonflower", "gsMoonglow"],
              },
            });
          },
        },
        {
          icon: "🐔💀",
          name: "Chicken Zombie",
          key: "gpChickenZombie",
          flavorText: "A spooky pet from the Lunar Glow Event.",
          price: 7000000,
          rarity: "Divine",
          stockChance: 0.05,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gpChickenZombie",
              name: "Chicken Zombie",
              flavorText: "Caged pet. Uncage to dig up Lunar seeds!",
              icon: "🐔💀",
              type: "gardenPetCage",
              sellPrice: 3500,
              petData: {
                name: "Chicken Zombie",
                collectionRate: 0.3,
                seedTypes: ["gsNightshade", "gsMoonBlossom"],
              },
            });
          },
        },
        {
          icon: "🌟",
          name: "Night Staff",
          key: "gtNightStaff",
          flavorText: "Boosts Moonlit mutations for Lunar crops.",
          price: 1500,
          rarity: "Rare",
          stockChance: 0.4,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtNightStaff",
              name: "Night Staff",
              flavorText: "Boosts Moonlit mutations for Lunar crops.",
              icon: "🌟",
              type: "gardenTool",
              sellPrice: 750,
              toolData: {
                growthMultiplier: 1.3,
                mutationChance: { Moonlit: 0.3 },
              },
            });
          },
        },
        {
          icon: "🥚🌙",
          name: "Night Egg",
          key: "gtNightEgg",
          flavorText: "A mysterious egg from the Lunar Glow Event.",
          price: 1000,
          rarity: "Uncommon",
          stockChance: 0.5,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtNightEgg",
              name: "Night Egg",
              flavorText: "A mysterious egg from the Lunar Glow Event.",
              icon: "🥚🌙",
              type: "gardenTool",
              sellPrice: 500,
              toolData: { growthMultiplier: 1.1 },
            });
          },
        },
        {
          icon: "📡",
          name: "Star Caller",
          key: "gtStarCaller",
          flavorText: "Enhances Celestial mutations for Lunar crops.",
          price: 2000,
          rarity: "Rare",
          stockChance: 0.3,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gtStarCaller",
              name: "Star Caller",
              flavorText: "Enhances Celestial mutations for Lunar crops.",
              icon: "📡",
              type: "gardenTool",
              sellPrice: 1000,
              toolData: {
                growthMultiplier: 1.2,
                mutationChance: { Celestial: 0.2 },
              },
            });
          },
        },
        // {
        //   icon: "📦",
        //   name: "Mysterious Crate",
        //   key: "gtMysteriousCrate",
        //   flavorText: "A crate of surprises from the Lunar Glow Event.",
        //   price: 2500,
        //   rarity: "Rare",
        //   stockChance: 0.3,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtMysteriousCrate",
        //       name: "Mysterious Crate",
        //       flavorText: "A crate of surprises from the Lunar Glow Event.",
        //       icon: "📦",
        //       type: "gardenTool",
        //       sellPrice: 1250,
        //       toolData: {
        //         seedTypes: ["gsMoonflower", "gsStarfruit", "gsMoonglow"],
        //       },
        //     });
        //   },
        // },
        // {
        //   icon: "🌱🌙",
        //   name: "Night Seed Pack",
        //   key: "gtNightSeedPack",
        //   flavorText: "A pack of lunar seeds from the Lunar Glow Event.",
        //   price: 1500,
        //   rarity: "Rare",
        //   stockChance: 0.4,
        //   inStock: true,
        //   onPurchase({ moneySet }) {
        //     moneySet.inventory.push({
        //       key: "gtNightSeedPack",
        //       name: "Night Seed Pack",
        //       flavorText: "A pack of lunar seeds from the Lunar Glow Event.",
        //       icon: "🌱🌙",
        //       type: "gardenTool",
        //       sellPrice: 750,
        //       toolData: {
        //         seedTypes: ["gsMoonBlossom", "gsBloodBanana", "gsMoonMelon"],
        //       },
        //     });
        //   },
        // },
      ],
    },
    {
      name: "Blood Moon",
      icon: "🌑",
      effect: {
        mutationChance: 0.2,
        growthMultiplier: 0.8,
        mutationType: "Bloodlit",
      },
      shopItems: [
        {
          icon: "🌹",
          name: "Blood Rose Seed",
          key: "gsBloodRose",
          flavorText: "A rare seed available during Blood Moon!",
          price: 250,
          rarity: "Divine",
          stockChance: 0.1,
          inStock: true,
          onPurchase({ moneySet }) {
            moneySet.inventory.push({
              key: "gsBloodRose",
              name: "Blood Rose Seed",
              flavorText: "A rare seed from Blood Moon.",
              icon: "🌹",
              type: "gardenSeed",
              sellPrice: 125,
              cropData: {
                baseValue: 500,
                growthTime: CROP_CONFIG.GROWTH_BASE * 3,
                harvests: 1,
              },
            });
          },
        },
      ],
    },
    {
      name: "Rainy Days",
      icon: "☔",
      effect: {
        mutationChance: 0.3,
        growthMultiplier: 1.5,
        mutationType: "Wet",
      },
      shopItems: [],
    },
  ],
};

function getCurrentEvent() {
  const weekNumber =
    Math.floor(Date.now() / EVENT_CONFIG.EVENT_CYCLE) %
    EVENT_CONFIG.EVENTS.length;
  const event = EVENT_CONFIG.EVENTS[weekNumber];

  gardenShop.itemData = gardenShop.itemData.filter(
    (item) =>
      !item.key.startsWith("gs") ||
      !event.shopItems.some((shopItem) => shopItem.key === item.key)
  );

  if (event.shopItems && event.shopItems.length > 0) {
    event.shopItems.forEach((shopItem) => {
      if (!gardenShop.itemData.some((item) => item.key === shopItem.key)) {
        gardenShop.itemData.push(shopItem);
      }
    });
  }

  return event;
}

const CROP_CONFIG = {
  MUTATIONS: [
    { name: "Wet", valueMultiplier: 2, chance: 0.1 },
    { name: "Gold", valueMultiplier: 1.5, chance: 0.05 },
    { name: "Disco", valueMultiplier: 2.25, chance: 0.02 },
    { name: "Shocked", valueMultiplier: 1.8, chance: 0.15 },
    { name: "Chilled", valueMultiplier: 1.6, chance: 0.1 },
    { name: "Bloodlit", valueMultiplier: 2.5, chance: 0.05 },
    { name: "Chocolate", valueMultiplier: 2.2, chance: 0.08 },
    { name: "Angry", valueMultiplier: 1.9, chance: 0.12 },
    { name: "Moonlit", valueMultiplier: 2.3, chance: 0.06 },
    { name: "Celestial", valueMultiplier: 2.4, chance: 0.04 },
    { name: "Chocolate", valueMultiplier: 2.1, chance: 0.07 },
  ],
  GROWTH_BASE: 5 * 60 * 1000,
  OVERGROWTH_PENALTY: 1.5,
  LUCKY_HARVEST_CHANCE: 0.05,
  ACHIEVEMENTS: [
    { key: "harvest_100", name: "Harvest Master", harvests: 100, reward: 1000 },
    { key: "mutation_10", name: "Mutation Maniac", mutations: 10, reward: 500 },
    { key: "expand_1", name: "Land Baron", expansions: 1, reward: 2000 },
  ],
};

const gardenShop = {
  key: "gardenShop",
  lastRestock: 0,
  stockRefreshInterval: 5 * 60 * 1000,
  itemData: [
    {
      icon: "🥕",
      name: "Carrot Seed",
      key: "gsCarrot",
      flavorText: "A basic crop for quick profits.",
      price: 10,
      rarity: "Common",
      inStock: true,
      isEventItem: false,
      stockChance: 1.0,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsCarrot",
          name: "Carrot Seed",
          flavorText: "A basic crop for quick profits.",
          icon: "🥕",
          type: "gardenSeed",
          sellPrice: 5,
          cropData: {
            baseValue: 20,
            growthTime: CROP_CONFIG.GROWTH_BASE,
            harvests: 1,
          },
        });
      },
    },
    {
      icon: "🍓",
      name: "Strawberry Seed",
      key: "gsStrawberry",
      flavorText: "Sweet berries with multiple harvests.",
      price: 50,
      rarity: "Common",
      inStock: true,

      stockChance: 1.0,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsStrawberry",
          name: "Strawberry Seed",
          flavorText: "Sweet berries with multiple harvests.",
          icon: "🍓",
          type: "gardenSeed",
          sellPrice: 25,
          cropData: {
            baseValue: 100,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🫐",
      name: "Blueberry Seed",
      key: "gsBlueberry",
      flavorText: "Tasty berries with multiple harvests.",
      price: 400,
      rarity: "Uncommon",
      inStock: true,

      stockChance: 0.5,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsBlueberry",
          name: "Blueberry Seed",
          flavorText: "Tasty berries with multiple harvests.",
          icon: "🫐",
          type: "gardenSeed",
          sellPrice: 200,
          cropData: {
            baseValue: 800,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🍅",
      name: "Tomato Seed",
      key: "gsTomato",
      flavorText: "Juicy tomatoes for big profits.",
      price: 800,
      rarity: "Rare",
      inStock: true,

      stockChance: 0.3,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsTomato",
          name: "Tomato Seed",
          flavorText: "Juicy tomatoes for big profits.",
          icon: "🍅",
          type: "gardenSeed",
          sellPrice: 400,
          cropData: {
            baseValue: 1600,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🍉",
      name: "Watermelon Seed",
      key: "gsWatermelon",
      flavorText: "Large fruit with high value.",
      price: 2500,
      rarity: "Legendary",
      inStock: true,

      stockChance: 0.14,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsWatermelon",
          name: "Watermelon Seed",
          flavorText: "Large fruit with high value.",
          icon: "🍉",
          type: "gardenSeed",
          sellPrice: 1250,
          cropData: {
            baseValue: 5000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4,
            harvests: 1,
          },
        });
      },
    },

    {
      icon: "🌷",
      name: "Orange Tulip Seed",
      key: "gsOrangeTulip",
      flavorText: "Bright and delicate flower crop.",
      price: 500,
      rarity: "Uncommon",
      inStock: true,
      stockChance: 0.6,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsOrangeTulip",
          name: "Orange Tulip Seed",
          flavorText: "Bright and delicate flower crop.",
          icon: "🌷",
          type: "gardenSeed",
          sellPrice: 250,
          cropData: {
            baseValue: 1000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🌽",
      name: "Corn Seed",
      key: "gsCorn",
      flavorText: "Golden grain with steady yield.",
      price: 1200,
      rarity: "Rare",
      inStock: true,
      stockChance: 0.4,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsCorn",
          name: "Corn Seed",
          flavorText: "Golden grain with steady yield.",
          icon: "🌽",
          type: "gardenSeed",
          sellPrice: 600,
          cropData: {
            baseValue: 2400,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🌼",
      name: "Daffodil Seed",
      key: "gsDaffodil",
      flavorText: "Cheerful flower with fair value.",
      price: 1000,
      rarity: "Rare",
      inStock: true,
      stockChance: 0.35,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsDaffodil",
          name: "Daffodil Seed",
          flavorText: "Cheerful flower with fair value.",
          icon: "🌼",
          type: "gardenSeed",
          sellPrice: 500,
          cropData: {
            baseValue: 2000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🍇",
      name: "Raspberry Seed",
      key: "gsRaspberry",
      flavorText: "Tart berry that grows in clusters.",
      price: 1400,
      rarity: "Rare",
      inStock: true,
      stockChance: 0.3,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsRaspberry",
          name: "Raspberry Seed",
          flavorText: "Tart berry that grows in clusters.",
          icon: "🍇",
          type: "gardenSeed",
          sellPrice: 700,
          cropData: {
            baseValue: 2800,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🍐",
      name: "Pear Seed",
      key: "gsPear",
      flavorText: "Soft and sweet fruit for the patient.",
      price: 1500,
      rarity: "Rare",
      inStock: true,
      stockChance: 0.25,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsPear",
          name: "Pear Seed",
          flavorText: "Soft and sweet fruit for the patient.",
          icon: "🍐",
          type: "gardenSeed",
          sellPrice: 750,
          cropData: {
            baseValue: 3000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🎃",
      name: "Pumpkin Seed",
      key: "gsPumpkin",
      flavorText: "A seasonal giant with huge value.",
      price: 3000,
      rarity: "Legendary",
      inStock: true,
      stockChance: 0.15,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsPumpkin",
          name: "Pumpkin Seed",
          flavorText: "A seasonal giant with huge value.",
          icon: "🎃",
          type: "gardenSeed",
          sellPrice: 1500,
          cropData: {
            baseValue: 6000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4,
            harvests: 1,
          },
        });
      },
    },
    {
      icon: "🍎",
      name: "Apple Seed",
      key: "gsApple",
      flavorText: "A classic fruit for every season.",
      price: 3500,
      rarity: "Legendary",
      inStock: true,
      stockChance: 0.12,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsApple",
          name: "Apple Seed",
          flavorText: "A classic fruit for every season.",
          icon: "🍎",
          type: "gardenSeed",
          sellPrice: 1750,
          cropData: {
            baseValue: 3500,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
            harvests: 4,
          },
        });
      },
    },
    {
      icon: "🎍",
      name: "Bamboo Seed",
      key: "gsBamboo",
      flavorText: "Fast-growing and sturdy.",
      price: 4000,
      rarity: "Legendary",
      inStock: true,
      stockChance: 0.1,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsBamboo",
          name: "Bamboo Seed",
          flavorText: "Fast-growing and sturdy.",
          icon: "🎍",
          type: "gardenSeed",
          sellPrice: 2000,
          cropData: {
            baseValue: 8000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🍈",
      name: "Coconut Seed",
      key: "gsCoconut",
      flavorText: "Tropical and rich in value.",
      price: 5000,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.07,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsCoconut",
          name: "Coconut Seed",
          flavorText: "Tropical and rich in value.",
          icon: "🥥",
          type: "gardenSeed",
          sellPrice: 2500,
          cropData: {
            baseValue: 10000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🌵",
      name: "Cactus Seed",
      key: "gsCactus",
      flavorText: "Tough crop for extreme climates.",
      price: 5200,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.06,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsCactus",
          name: "Cactus Seed",
          flavorText: "Tough crop for extreme climates.",
          icon: "🌵",
          type: "gardenSeed",
          sellPrice: 2600,
          cropData: {
            baseValue: 10400,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
            harvests: 1,
          },
        });
      },
    },

    {
      icon: "🐉",
      name: "Dragon Fruit Seed",
      key: "gsDragonFruit",
      flavorText: "Exotic and magical fruit.",
      price: 6000,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.05,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsDragonFruit",
          name: "Dragon Fruit Seed",
          flavorText: "Exotic and magical fruit.",
          icon: "🐉",
          type: "gardenSeed",
          sellPrice: 3000,
          cropData: {
            baseValue: 3000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 5,
            harvests: 10,
          },
        });
      },
    },
    {
      icon: "🥭",
      name: "Mango Seed",
      key: "gsMango",
      flavorText: "Sweet tropical fruit with great flavor.",
      price: 5500,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.06,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsMango",
          name: "Mango Seed",
          flavorText: "Sweet tropical fruit with great flavor.",
          icon: "🥭",
          type: "gardenSeed",
          sellPrice: 2750,
          cropData: {
            baseValue: 11000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🍑",
      name: "Peach Seed",
      key: "gsPeach",
      flavorText: "Juicy fruit perfect for desserts.",
      price: 5000,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.07,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsPeach",
          name: "Peach Seed",
          flavorText: "Juicy fruit perfect for desserts.",
          icon: "🍑",
          type: "gardenSeed",
          sellPrice: 2500,
          cropData: {
            baseValue: 10000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🍍",
      name: "Pineapple Seed",
      key: "gsPineapple",
      flavorText: "Tropical fruit with a tough exterior.",
      price: 5200,
      rarity: "Mythical",
      inStock: true,
      stockChance: 0.06,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsPineapple",
          name: "Pineapple Seed",
          flavorText: "Tropical fruit with a tough exterior.",
          icon: "🍍",
          type: "gardenSeed",
          sellPrice: 2600,
          cropData: {
            baseValue: 10400,
            growthTime: CROP_CONFIG.GROWTH_BASE * 4,
            harvests: 1,
          },
        });
      },
    },

    {
      icon: "🍇",
      name: "Grape Seed",
      key: "gsGrape",
      flavorText: "Sweet clusters perfect for wine.",
      price: 4500,
      rarity: "Divine",
      inStock: true,
      stockChance: 0.08,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsGrape",
          name: "Grape Seed",
          flavorText: "Sweet clusters perfect for wine.",
          icon: "🍇",
          type: "gardenSeed",
          sellPrice: 2250,
          cropData: {
            baseValue: 9000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🍄",
      name: "Mushroom Seed",
      key: "gsMushroom",
      flavorText: "Fungi with earthy flavor and value.",
      price: 4000,
      rarity: "Divine",
      inStock: true,
      stockChance: 0.09,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsMushroom",
          name: "Mushroom Seed",
          flavorText: "Fungi with earthy flavor and value.",
          icon: "🍄",
          type: "gardenSeed",
          sellPrice: 2000,
          cropData: {
            baseValue: 8000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2.5,
            harvests: 3,
          },
        });
      },
    },
    {
      icon: "🌶️",
      name: "Pepper Seed",
      key: "gsPepper",
      flavorText: "Spicy crop that adds heat to dishes.",
      price: 4200,
      rarity: "Divine",
      inStock: true,
      stockChance: 0.07,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsPepper",
          name: "Pepper Seed",
          flavorText: "Spicy crop that adds heat to dishes.",
          icon: "🌶️",
          type: "gardenSeed",
          sellPrice: 2100,
          cropData: {
            baseValue: 8400,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🍫",
      name: "Cacao Seed",
      key: "gsCacao",
      flavorText: "Bean for rich chocolate production.",
      price: 4800,
      rarity: "Divine",
      inStock: true,
      stockChance: 0.06,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsCacao",
          name: "Cacao Seed",
          flavorText: "Bean for rich chocolate production.",
          icon: "🍫",
          type: "gardenSeed",
          sellPrice: 2400,
          cropData: {
            baseValue: 9600,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3.5,
            harvests: 2,
          },
        });
      },
    },

    {
      icon: "🌱",
      name: "Beanstalk Seed",
      key: "gsBeanstalk",
      flavorText: "Magical vine that reaches the skies.",
      price: 7000,
      rarity: "Prismatic",
      inStock: true,
      stockChance: 0.04,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsBeanstalk",
          name: "Beanstalk Seed",
          flavorText: "Magical vine that reaches the skies.",
          icon: "🌱",
          type: "gardenSeed",
          sellPrice: 3500,
          cropData: {
            baseValue: 3000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 5,
            harvests: 20,
          },
        });
      },
    },

    // {
    //   icon: "🌙",
    //   name: "Moonflower Seed",
    //   key: "gsMoonflower",
    //   flavorText: "Rare flower blooming under moonlight.",
    //   price: 8000,
    //   rarity: "Legendary",
    //   inStock: false,
    //   stockChance: 0,
    //   onPurchase({ moneySet }) {
    //     moneySet.inventory.push({
    //       key: "gsMoonflower",
    //       name: "Moonflower Seed",
    //       flavorText: "Rare flower blooming under moonlight.",
    //       icon: "🌙",
    //       type: "gardenSeed",
    //       sellPrice: 4000,
    //       cropData: {
    //         baseValue: 16000,
    //         growthTime: CROP_CONFIG.GROWTH_BASE * 4.5,
    //         harvests: 1,
    //       },
    //     });
    //   },
    // },
    {
      icon: "🍃",
      name: "Mint Seed",
      key: "gsMint",
      flavorText: "Refreshing herb with culinary uses.",
      price: 2200,
      rarity: "Rare",
      inStock: false,
      stockChance: 0,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsMint",
          name: "Mint Seed",
          flavorText: "Refreshing herb with culinary uses.",
          icon: "🍃",
          type: "gardenSeed",
          sellPrice: 1100,
          cropData: {
            baseValue: 4400,
            growthTime: CROP_CONFIG.GROWTH_BASE * 2,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🍄",
      name: "Glowshroom Seed",
      key: "gsGlowshroom",
      flavorText: "Bioluminescent mushroom with unique glow.",
      price: 3000,
      rarity: "Rare",
      inStock: false,
      stockChance: 0,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gsGlowshroom",
          name: "Glowshroom Seed",
          flavorText: "Bioluminescent mushroom with unique glow.",
          icon: "🍄",
          type: "gardenSeed",
          sellPrice: 1500,
          cropData: {
            baseValue: 6000,
            growthTime: CROP_CONFIG.GROWTH_BASE * 3,
            harvests: 2,
          },
        });
      },
    },
    {
      icon: "🐶",
      name: "Dog",
      key: "gpDog",
      flavorText: "Caged pet. Uncage to dig up seeds!",
      price: 100000,
      rarity: "Common",
      inStock: true,

      stockChance: 0.8,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gpDog",
          name: "Dog",
          flavorText: "Caged pet. Use uncage to release!",
          icon: "🐶",
          type: "gardenPetCage",
          sellPrice: 50000000,
          petData: {
            name: "Dog",
            collectionRate: 0.05,
            seedTypes: ["gsCarrot", "gsStrawberry", "gsBlueberry", "gsTomato"],
          },
        });
      },
    },
    {
      icon: "💦",
      inStock: true,

      name: "Sprinkler",
      key: "gtSprinkler",
      flavorText:
        "Boosts growth speed and Wet mutations. You only need one of these in your inventory to work.",
      price: 200,
      rarity: "Common",
      stockChance: 0.7,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gtSprinkler",
          name: "Sprinkler",
          flavorText: "Boosts growth speed and Wet mutations.",
          icon: "💦",
          type: "gardenTool",
          sellPrice: 100,
          toolData: { growthMultiplier: 1.2, mutationChance: { Wet: 0.2 } },
        });
      },
    },
    {
      icon: "🌿",
      name: "Fertilizer",
      key: "gtFertilizer",
      flavorText:
        "Increases Gold and Disco mutations. You only need one of these in your inventory to work.",
      price: 500,
      inStock: true,

      rarity: "Uncommon",
      stockChance: 0.5,
      onPurchase({ moneySet }) {
        moneySet.inventory.push({
          key: "gtFertilizer",
          name: "Fertilizer",
          flavorText: "Increases Gold and Disco mutations.",
          icon: "🌿",
          type: "gardenTool",
          sellPrice: 250,
          toolData: {
            growthMultiplier: 1,
            mutationChance: { Gold: 0.1, Disco: 0.05 },
          },
        });
      },
    },
    // {
    //   icon: "⭐",
    //   name: "Favorite Tool",
    //   key: "gtFavorite",
    //   inStock: true,

    //   flavorText:
    //     "Allows favoriting crops to prevent selling. You only need one of these in your inventory to work.",
    //   price: 1000,
    //   rarity: "Rare",
    //   stockChance: 0.3,
    //   onPurchase({ moneySet }) {
    //     moneySet.inventory.push({
    //       key: "gtFavorite",
    //       name: "Favorite Tool",
    //       flavorText: "Allows favoriting crops to prevent selling.",
    //       icon: "⭐",
    //       type: "gardenTool",
    //       sellPrice: 500,
    //       toolData: { favoriteEnabled: true },
    //     });
    //   },
    // },
  ],
  welcomeTexts: [
    "🌱 Welcome to Sam's Garden Shop! Start growing today!",
    "🌱 Hey there! Ready to plant some crops?",
    "🌱 Browse our seeds, pets, and tools to boost your farm!",
  ],
  buyTexts: [
    "🌱 What do you want to buy today?",
    "🌱 Pick a seed, pet, or tool to grow your garden!",
    "🌱 Let me know what catches your eye!",
  ],
  thankTexts: [
    "🌱 Thanks for shopping! Happy planting!",
    "🌱 Your garden's gonna thrive with that!",
    "🌱 Come back soon for more goodies!",
  ],
};

export type GardenSeed = InventoryItem & {
  type: "gardenSeed";
  cropData: { baseValue: number; growthTime: number; harvests: number };
  isFavorite?: boolean;
};

export type GardenPetCage = InventoryItem & {
  type: "gardenPetCage";
  petData: { name: string; collectionRate: number; seedTypes: string[] };
  isFavorite?: boolean;
};

export type GardenTool = InventoryItem & {
  type: "gardenTool";
  toolData: {
    growthMultiplier?: number;
    mutationChance?: { [key: string]: number };
    favoriteEnabled?: boolean;
  };
  isFavorite?: boolean;
};

export type GardenPlot = InventoryItem & {
  key: string;
  seedKey: string;
  name: string;
  icon: string;
  plantedAt: number;
  growthTime: number;
  harvestsLeft: number;
  baseValue: number;
  mutation: string | null;
  isFavorite?: boolean;
};

export type GardenPetActive = InventoryItem & {
  key: string;
  name: string;
  icon: string;
  lastCollect: number;
  petData: { collectionRate: number; seedTypes: string[] };
  isEquipped: boolean;
};

export interface GardenStats {
  plotsHarvested: number;
  mutationsFound: number;
  expansions: number;
  achievements: string[];
}

export type GardenItem = GardenSeed | GardenPetCage | GardenTool;

function calculateCropValue(
  crop: GardenPlot,
  plots: Inventory<GardenPlot>,
  expansions: number,
  totalEarns: number
) {
  const mutation = CROP_CONFIG.MUTATIONS.find((m) => m.name === crop.mutation);
  const plantedCount = plots.getAll().length;
  const plantingBonus = Math.min(1, 0.1 * Math.floor(plantedCount / 10));
  const expansionBonus = 0.05 * expansions;

  const earnMultiplier = Math.max(
    1,
    Math.min(1000000000, ((1 / 100_000) * totalEarns) ** 0.2)
  );

  return Math.floor(
    crop.baseValue *
      (mutation ? mutation.valueMultiplier : 1) *
      (1 + plantingBonus + expansionBonus) *
      earnMultiplier
  );
}

function isCropReady(crop: GardenPlot) {
  return Date.now() >= crop.plantedAt + crop.growthTime && !crop.isFavorite;
}

function autoUpdateCropData(crop: GardenPlot, tools: Inventory<GardenTool>) {
  if (!crop) return null;
  const event = getCurrentEvent();
  let growthMultiplier = event.effect?.growthMultiplier || 1;
  tools.getAll().forEach((tool) => {
    if (tool.toolData?.growthMultiplier) {
      growthMultiplier *= tool.toolData.growthMultiplier;
    }
  });
  crop.growthTime = Math.floor(crop.growthTime / growthMultiplier);
  if (crop.mutation && crop.harvestsLeft > 1) {
    crop.growthTime = Math.floor(
      crop.growthTime * CROP_CONFIG.OVERGROWTH_PENALTY
    );
  }
  return crop;
}

function getTimeForNextEvent() {
  const cycle = EVENT_CONFIG.EVENT_CYCLE;
  const now = Date.now();
  const timeIntoCycle = now % cycle;
  const timeUntilNextEvent = cycle - timeIntoCycle;
  return timeUntilNextEvent;
}

function applyMutation(crop: GardenPlot, tools: Inventory<GardenTool>) {
  const event = getCurrentEvent();
  let mutationChance = event.effect?.mutationChance || 0;
  tools.getAll().forEach((tool) => {
    if (tool.toolData?.mutationChance) {
      Object.entries(tool.toolData.mutationChance).forEach(([, value]) => {
        mutationChance += value;
      });
    }
  });

  const roll = Math.random();
  let cumulativeChance = 0;
  const mutations = event.effect?.mutationType
    ? CROP_CONFIG.MUTATIONS.filter(
        (m) => m.name === event.effect.mutationType
      ).concat(
        CROP_CONFIG.MUTATIONS.filter(
          (m) => m.name !== event.effect.mutationType
        )
      )
    : CROP_CONFIG.MUTATIONS;
  for (const mutation of mutations) {
    cumulativeChance += mutation.chance * (1 + mutationChance);
    if (roll <= cumulativeChance) {
      crop.mutation = mutation.name;
      return crop;
    }
  }
  return crop;
}

function updatePetCollection(
  pet: GardenPetActive,
  inventory: Inventory<GardenItem>,
  ctx: CommandContext
): {
  pet: GardenPetActive;
  collections: number;
  inventory: Inventory<GardenItem>;
  collected: GardenItem[];
} {
  if (!pet.isEquipped) return { pet, collections: 0, inventory, collected: [] };
  const currentTime = Date.now();
  const timeSinceLastCollect = currentTime - (pet.lastCollect || currentTime);
  const collections = Math.round(
    Math.floor(timeSinceLastCollect / (60 * 1000)) * pet.petData.collectionRate
  );
  const collected: GardenItem[] = [];
  if (collections >= 1) {
    pet.lastCollect = currentTime;
    for (let i = 0; i < collections; i++) {
      const seed =
        pet.petData.seedTypes[
          Math.floor(Math.random() * pet.petData.seedTypes.length)
        ];
      const shopItem = gardenShop.itemData.find((item) => item.key === seed);
      if (shopItem && inventory.size() < global.Cassidy.invLimit) {
        const cache = inventory.getAll();
        const cache2 = [...cache];
        shopItem.onPurchase({ ...ctx, moneySet: { inventory: cache } });
        inventory = new Inventory(cache);
        const newItems = cache.filter((i) => !cache2.includes(i));
        collected.push(...newItems);
      }
    }
  }
  return { pet, collections: collected.length, inventory, collected };
}

async function checkAchievements(
  user: UserData,
  money: UserStatsManager,
  output: OutputProps,
  input: InputClass
) {
  const plotsHarvested = user.gardenStats?.plotsHarvested || 0;
  const mutationsFound = user.gardenStats?.mutationsFound || 0;
  const expansions = user.gardenStats?.expansions || 0;
  let newMoney = user.money || 0;
  let achievementsUnlocked: string[] = [];

  for (const achievement of CROP_CONFIG.ACHIEVEMENTS) {
    if (!user.gardenStats?.achievements?.includes(achievement.key)) {
      if (
        achievement.key === "harvest_100" &&
        plotsHarvested >= achievement.harvests
      ) {
        newMoney += achievement.reward;
        achievementsUnlocked.push(
          `${achievement.name} (+${formatCash(achievement.reward)})`
        );
        user.gardenStats.achievements = user.gardenStats.achievements || [];
        user.gardenStats.achievements.push(achievement.key);
      } else if (
        achievement.key === "mutation_10" &&
        mutationsFound >= achievement.mutations
      ) {
        newMoney += achievement.reward;
        achievementsUnlocked.push(
          `${achievement.name} (+${formatCash(achievement.reward)})`
        );
        user.gardenStats.achievements = user.gardenStats.achievements || [];
        user.gardenStats.achievements.push(achievement.key);
      } else if (
        achievement.key === "expand_1" &&
        expansions >= achievement.expansions
      ) {
        newMoney += achievement.reward;
        achievementsUnlocked.push(
          `${achievement.name} (+${formatCash(achievement.reward)})`
        );
        user.gardenStats.achievements = user.gardenStats.achievements || [];
        user.gardenStats.achievements.push(achievement.key);
      }
    }
  }

  if (achievementsUnlocked.length > 0) {
    await money.setItem(user.senderID, {
      money: newMoney,
      gardenStats: user.gardenStats,
    });
    if (!input.isWeb) {
      await output.replyStyled(
        `🏆 **Achievements Unlocked**:\n${achievementsUnlocked.join(
          "\n"
        )}\n\n💰 New Balance: ${formatCash(newMoney)}`,
        style
      );
    }
  }
}
function refreshShopStock() {
  const currentTime = Date.now();
  if (currentTime - gardenShop.lastRestock < gardenShop.stockRefreshInterval)
    return;
  gardenShop.lastRestock = currentTime;

  const event = getCurrentEvent();
  gardenShop.itemData = gardenShop.itemData.filter((item) => {
    if (item.isEventItem) {
      return (
        event.shopItems &&
        event.shopItems.some((shopItem) => shopItem.key === item.key)
      );
    }
    return true;
  });

  if (event.shopItems && event.shopItems.length > 0) {
    event.shopItems.forEach((shopItem) => {
      if (!gardenShop.itemData.some((item) => item.key === shopItem.key)) {
        gardenShop.itemData.push({ ...shopItem, isEventItem: true });
      }
    });
  }

  gardenShop.itemData.forEach((item) => {
    item.inStock = item.isEventItem ? true : Math.random() < item.stockChance;
  });
}

export async function entry(ctx: CommandContext) {
  const {
    input,
    output,
    money,
    Inventory,
    UTShop,
    prefix,
    commandName,
    command,
  } = ctx;
  await money.ensureUserInfo(input.senderID);

  let {
    name = "",
    gardenPlots: rawPlots = [],
    gardenPets: rawPets = [],
    inventory: rawInventory = [],
    money: userMoney = 0,
    gardenStats = {
      plotsHarvested: 0,
      mutationsFound: 0,
      expansions: 0,
      achievements: [],
    },
    plotLimit = PLOT_LIMIT,
    lastSideExpansion = 0,
    lastRearExpansion1 = 0,
    lastRearExpansion2 = 0,
    // allowGifting = true,
    gardenEarns = 0,
    collectibles: rawCLL,
  } = await money.getCache(input.senderID);
  let isHypen = false;
  const collectibles = new Collectibles(rawCLL);

  const currEvent = getCurrentEvent();
  let hasEvent = !currEvent.isNoEvent;

  const style: CommandStyle = {
    ...command.style,
    title: {
      content: `${currEvent.icon} ${UNISpectra.charm} **G🍅rden**`,
      text_font: "fancy",
      line_bottom: "default",
    },
    footer: {
      content: hasEvent
        ? `‼️ Event: **${currEvent.name}** ${
            (currEvent.shopItems ?? []).length > 0
              ? `(+${(currEvent.shopItems ?? []).length} Shop Items!)`
              : ""
          }`
        : "Rewards multiply with success.",
      text_font: "fancy",
    },
  };

  if (!name || name === "Unregistered") {
    return output.reply(
      `🌱 Please register first!\nUse: **${prefix}register** without fonts.`
    );
  }

  output.setStyle(style);

  refreshShopStock();

  const home = new SpectralCMDHome({ isHypen }, [
    {
      key: "shop",
      description: "Visit Sam's Garden Shop",
      aliases: ["-sh"],
      async handler() {
        const shop = new UTShop({
          ...gardenShop,
          itemData: gardenShop.itemData.filter(
            (item) => item.inStock !== false
          ),
          style,
        });
        await shop.onPlay({ ...ctx, args: [] });
      },
    },
    {
      key: "plant",
      description: "Plant one or more seeds in plots",
      aliases: ["-p"],
      args: ["[seed_key] [quantity]"],
      async handler(_, { spectralArgs }) {
        let inventory = new Inventory<GardenItem | InventoryItem>(rawInventory);
        let plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        let seeds = inventory
          .toUnique()
          .filter((item): item is GardenSeed => item.type === "gardenSeed");
        const availablePlots = plotLimit - plots.getAll().length;
        if (availablePlots <= 0) {
          return output.replyStyled(
            `🌱 Max plots reached (${
              plots.getAll().length
            }/${plotLimit})! Harvest with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }harvest or expand with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }expand.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest\n` +
              `${UNISpectra.arrowFromT} Expand plot: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }expand`,
            style
          );
        }
        if (seeds.length === 0) {
          return output.replyStyled(
            `🌱 No seeds! Buy some with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }shop.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Visit shop: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop\n` +
              `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list`,
            style
          );
        }

        let seed: GardenSeed | null = null;
        let quantity =
          parseBet(
            spectralArgs[1],
            inventory.getAmount(spectralArgs[0] || "")
          ) || 1;
        quantity = Math.min(
          quantity,
          availablePlots,
          inventory.getAmount(spectralArgs[0] || "")
        );
        if (spectralArgs[0]) {
          const selected = inventory.getOne(spectralArgs[0]);
          if (selected && selected.type === "gardenSeed") {
            seed = selected as GardenSeed;
          }
        }
        if (!seed || quantity < 1) {
          const seedList = seeds
            .map(
              (s) =>
                `**x${inventory.getAmount(s.key)}** ${s.icon} **${
                  s.name
                }** (Key: **${s.key}**)`
            )
            .join("\n");
          return output.replyStyled(
            `❌ Invalid seed key${
              spectralArgs[0] ? ` "${spectralArgs[0]}"` : ""
            } or quantity! Use: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant [seed_key] [quantity]\n\n` +
              `**Available Seeds**:\n${seedList || "None"}\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list\n` +
              `${UNISpectra.arrowFromT} Buy seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }

        const planted: string[] = [];
        for (let i = 0; i < quantity; i++) {
          if (
            inventory.getAmount(seed.key) <= 0 ||
            plots.getAll().length >= plotLimit
          )
            break;
          inventory.deleteOne(seed.key);
          const plot: GardenPlot = {
            key: `plot_${Date.now()}_${i}`,
            seedKey: seed.key,
            name: seed.name,
            icon: seed.icon,
            plantedAt: Date.now(),
            growthTime: seed.cropData.growthTime,
            harvestsLeft: seed.cropData.harvests,
            baseValue: seed.cropData.baseValue,
            mutation: null,
            type: "activePlot",
            isFavorite: false,
          };
          applyMutation(
            plot,
            new Inventory<GardenTool>(
              rawInventory.filter(
                (item) => item.type === "gardenTool"
              ) as GardenTool[]
            )
          );
          autoUpdateCropData(
            plot,
            new Inventory<GardenTool>(
              rawInventory.filter(
                (item) => item.type === "gardenTool"
              ) as GardenTool[]
            )
          );
          plots.addOne(plot);
          if (plot.mutation) {
            gardenStats.mutationsFound = (gardenStats.mutationsFound || 0) + 1;
          }
          planted.push(
            `${seed.icon} **${seed.name}**${
              plot.mutation ? ` (${plot.mutation})` : ""
            }`
          );
        }

        await money.setItem(input.senderID, {
          inventory: Array.from(inventory),
          gardenPlots: Array.from(plots),
          gardenStats,
        });
        await checkAchievements(
          {
            ...ctx.user,
            gardenStats,
            senderID: input.senderID,
            money: userMoney,
          },
          money,
          output,
          input
        );

        return ctx.output.replyStyled(
          `🌱 Planted ${planted.length} seed${
            planted.length !== 1 ? "s" : ""
          } (${plots.getAll().length}/${plotLimit} plots):\n${planted.join(
            "\n"
          )}\n` +
            `⏳ First ready in: ${
              formatTimeSentence(seed.cropData.growthTime) ||
              "***ALREADY READY!***"
            }\n` +
            `💰 Base Value: ${formatCash(
              calculateCropValue(
                {
                  ...plots.getAll()[plots.getAll().length - 1],
                  mutation: null,
                },
                plots,
                gardenStats.expansions || 0,
                gardenEarns
              )
            )}\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plots\n` +
            `${UNISpectra.arrowFromT} Harvest later: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }harvest`,
          style
        );
      },
    },
    {
      key: "harvest",
      description: "Harvest ready crops",
      aliases: ["-h"],
      async handler() {
        const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        let inventory = new Inventory<GardenItem | InventoryItem>(rawInventory);
        let moneyEarned = 0;
        const harvested: string[] = [];
        const seedsGained: string[] = [];
        const tools = new Inventory<GardenTool>(
          rawInventory.filter(
            (item) => item.type === "gardenTool"
          ) as GardenTool[]
        );
        const readyPlots = plots
          .getAll()
          .map((i) => autoUpdateCropData(i, tools))
          .filter((i) => plots.get(i.key).every((i) => !i.isFavorite))
          .filter(isCropReady);
        if (readyPlots.length === 0) {
          return output.replyStyled(
            `🌱 No crops ready! Check plots with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plots.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} View plots: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plots\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant`,
            style
          );
        }

        for (const plot of readyPlots) {
          autoUpdateCropData(
            plot,
            new Inventory<GardenTool>(
              rawInventory.filter(
                (item) => item.type === "gardenTool"
              ) as GardenTool[]
            )
          );
          const value = calculateCropValue(
            plot,
            plots,
            gardenStats.expansions || 0,
            gardenEarns
          );
          moneyEarned += value;
          gardenEarns += value - plot.baseValue;
          harvested.push(
            `${plot.icon} ${plot.name}${
              plot.mutation
                ? ` (${plot.mutation}, +${formatCash(value - plot.baseValue)})`
                : ""
            } - ${formatCash(value, true)}`
          );
          plot.harvestsLeft -= 1;
          gardenStats.plotsHarvested = (gardenStats.plotsHarvested || 0) + 1;
          if (Math.random() < CROP_CONFIG.LUCKY_HARVEST_CHANCE) {
            const shopItem = gardenShop.itemData.find(
              (item) => item.key === plot.seedKey
            );
            if (shopItem && inventory.size() < global.Cassidy.invLimit) {
              const cache = inventory.getAll();
              shopItem.onPurchase({ ...ctx, moneySet: { inventory: cache } });
              inventory = new Inventory(cache);
              seedsGained.push(`${plot.icon} ${plot.name} (Seed)`);
            }
          }
          if (plot.harvestsLeft <= 0) {
            plots.deleteOne(plot.key);
          } else {
            plot.plantedAt = Date.now();
            applyMutation(
              plot,
              new Inventory<GardenTool>(
                rawInventory.filter(
                  (item) => item.type === "gardenTool"
                ) as GardenTool[]
              )
            );
            plots.deleteOne(plot.key);
            plots.addOne(plot);
          }
        }

        await money.setItem(input.senderID, {
          money: userMoney + moneyEarned,
          gardenPlots: Array.from(plots),
          inventory: Array.from(inventory),
          gardenStats,
          gardenEarns,
        });
        await checkAchievements(
          {
            ...ctx.user,
            gardenStats,
            senderID: input.senderID,
            money: userMoney + moneyEarned,
          },
          money,
          output,
          input
        );

        return output.replyStyled(
          `✅ **Harvested**:\n${harvested.join("\n")}\n\n` +
            (seedsGained.length > 0
              ? `🌱 **Lucky Harvest Seeds**:\n${seedsGained.join("\n")}\n\n`
              : "") +
            `💰 Earned: ${formatCash(moneyEarned, true)}\n` +
            `💵 Balance: ${formatCash(userMoney + moneyEarned)}\n\n` +
            `📈 Total Earns: ${formatCash(gardenEarns)}\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Plant more: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant\n` +
            `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plots`,
          style
        );
      },
    },
    {
      key: "plots",
      description: "View your garden plots",
      aliases: ["-pl"],
      args: ["[page]"],
      async handler(_, { spectralArgs }) {
        const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        const page = parseInt(spectralArgs[0]) || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = page * ITEMS_PER_PAGE;
        const currentPlots = [...plots.getAll()]
          .sort((a, b) => {
            const at = a.plantedAt + a.growthTime - Date.now();
            const ab = b.plantedAt + b.growthTime - Date.now();
            return at - ab;
          })
          .slice(start, end);
        let result = `🌱 **${name}'s Garden Plots (${
          plots.getAll().length
        }/${plotLimit}, Page ${page})**:\n\n`;
        if (currentPlots.length === 0) {
          return output.replyStyled(
            `🌱 No plots! Plant seeds with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Buy seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }

        currentPlots.forEach((plot, index) => {
          autoUpdateCropData(
            plot,
            new Inventory<GardenTool>(
              rawInventory.filter(
                (item) => item.type === "gardenTool"
              ) as GardenTool[]
            )
          );
          const timeLeft = plot.plantedAt + plot.growthTime - Date.now();
          result +=
            `${start + index + 1}. ${plot.icon} **${plot.name}**${
              plot.mutation ? ` (${plot.mutation})` : ""
            }${plots.get(plot.key).some((i) => i.isFavorite) ? ` ⭐` : ""}\n` +
            `${UNIRedux.charm} Harvests Left: ${plot.harvestsLeft}\n` +
            `${UNIRedux.charm} Time Left: ${
              formatTimeSentence(timeLeft) || "***READY***!"
            }\n` +
            `${UNIRedux.charm} Value: ${formatCash(
              calculateCropValue(
                plot,
                plots,
                gardenStats.expansions || 0,
                gardenEarns
              )
            )}\n\n`;
        });
        if (plots.getAll().length > end) {
          result += `View more: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }plots ${page + 1}\n`;
        }

        result += `\n📈 Total Earns: ${formatCash(gardenEarns, true)}\n\n`;

        result +=
          `**Next Steps**:\n` +
          `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }harvest\n` +
          `${UNISpectra.arrowFromT} Favorite crops: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }favorite`;

        return output.replyStyled(result, style);
      },
    },
    {
      key: "top",
      description:
        "View top 10 garden earners (paged, ranks 20-11 for page 2, etc.)",
      aliases: ["-t"],
      args: ["[page]"],
      async handler(_, { spectralArgs }) {
        const page = parseInt(spectralArgs[0]) || 1;
        const startRank = (page - 1) * 10 + 1;
        const endRank = startRank + 9;

        const allUsers = await money.getAllCache();
        const userStats: {
          userId: string;
          name: string;
          totalEarns: number;
        }[] = [];

        for (const user of Object.values(allUsers)) {
          if (
            ((user.gardenPlots as GardenPlot[]) ?? []).length === 0 &&
            ((user.gardenEarns as number) ?? 0) < 1
          ) {
            continue;
          }
          const plots = new Inventory<GardenPlot>(
            user.gardenPlots || [],
            user.plotLimit || PLOT_LIMIT
          );

          let potentialEarnings = 0;

          plots.getAll().forEach((plot) => {
            if (isCropReady(plot)) {
              const value = calculateCropValue(
                plot,
                plots,
                user.gardenStats?.expansions || 0,
                user.gardenEarns || 0
              );
              potentialEarnings += value * plot.harvestsLeft;
            }
          });

          userStats.push({
            userId: user.senderID,
            name: user.name || "Farmer",
            totalEarns: (user.gardenEarns || 0) + potentialEarnings,
          });
        }

        const sortedUsers = userStats.sort(
          (a, b) => b.totalEarns - a.totalEarns
        );
        const currentPageUsers = sortedUsers.slice(startRank - 1, endRank);

        let result = `🏆 **TOP ${endRank} GARDENERS**\n${UNISpectra.arrowFromT} Page **${page}**:\n\n`;
        if (currentPageUsers.length === 0) {
          return output.replyStyled(
            `🌱 No users found for ranks ${startRank}-${endRank}!\n\n` +
              `**Next Steps**:\n` +
              `${
                UNISpectra.arrowFromT
              } Check another page: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }top [page]\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest`,
            style
          );
        }

        currentPageUsers.forEach((user, index) => {
          result +=
            `━━━━━━ ${startRank + index} ━━━━━━\n` +
            `${UNIRedux.arrowFromT}  **${user.name}**\n` +
            `📊🌱 ${formatCash(user.totalEarns, true)}\n`;
        });

        if (sortedUsers.length > endRank) {
          result += `${
            UNIRedux.standardLine
          }\nView more: ${prefix}${commandName}${isHypen ? "-" : " "}top ${
            page + 1
          }\n`;
        }
        if (page > 2) {
          result += `View previous: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }top ${page - 1}\n`;
        }

        result +=
          `\n**Next Steps**:\n` +
          `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }harvest\n` +
          `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }plant`;

        return output.replyStyled(result, style);
      },
    },
    {
      key: "list",
      description: "View garden-related items",
      aliases: ["-l"],
      args: ["[page]"],
      async handler(_, { spectralArgs }) {
        const inventory = new Inventory<GardenItem | InventoryItem>(
          rawInventory
        );
        const gardenItems = inventory
          .toUnique()
          .filter((item) =>
            ["gardenSeed", "gardenPetCage", "gardenTool"].includes(item.type)
          );
        const page = parseInt(spectralArgs[0]) || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = page * ITEMS_PER_PAGE;
        const currentItems = gardenItems.slice(start, end);
        let result = `🎒 **${name}'s Garden Items (Page ${page})**:\n\n`;
        if (currentItems.length === 0) {
          return output.replyStyled(
            `🌱 No garden items! Buy some with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }shop.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Visit shop: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant`,
            style
          );
        }

        currentItems.forEach((_item, index) => {
          let item = _item as GardenItem;
          const count = inventory.getAmount(item.key);
          result +=
            `${start + index + 1}. ${item.icon} **${item.name}**${
              count > 1 ? ` (x${count})` : ""
            }${
              inventory.get(item.key).some((i) => i.isFavorite) ? ` ⭐` : ""
            }\n` +
            `${UNIRedux.charm} Type: ${item.type}\n` +
            `${UNIRedux.charm} Key: **${item.key}**\n` +
            `${UNIRedux.charm} Sell Price: ${formatCash(item.sellPrice)}\n` +
            (item.type === "gardenPetCage"
              ? `${UNIRedux.charm} Collects: ${item.petData.seedTypes.join(
                  ", "
                )} (${item.petData.collectionRate}/min)\n`
              : "") +
            (item.type === "gardenTool"
              ? `${UNIRedux.charm} Effect: ${
                  item.toolData.favoriteEnabled
                    ? "Enables favoriting"
                    : `Growth ${
                        item.toolData.growthMultiplier || 1
                      }x, Mutations +${
                        Object.values(
                          item.toolData.mutationChance || {}
                        ).reduce((a, b) => a + b, 0) * 100
                      }%`
                }\n`
              : "") +
            `\n`;
        });
        if (gardenItems.length > end) {
          result += `View more: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }list ${page + 1}\n`;
        }

        result +=
          `**Next Steps**:\n` +
          `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }plant\n` +
          `${UNISpectra.arrowFromT} Favorite items: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }favorite`;

        return output.replyStyled(result, style);
      },
    },
    // {
    //   key: "favorite",
    //   description: "Favorite an item or crop to prevent selling",
    //   aliases: ["-f"],
    //   args: ["[item_key]"],
    //   async handler(_, { spectralArgs }) {
    //     const inventory = new Inventory<GardenItem | InventoryItem>(
    //       rawInventory
    //     );
    //     const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
    //     const hasFavoriteTool = inventory
    //       .getAll()
    //       .some(
    //         (item) =>
    //           item.type === "gardenTool" &&
    //           (item as GardenTool).toolData?.favoriteEnabled
    //       );
    //     const items = inventory
    //       .getAll()
    //       .filter((item) =>
    //         ["gardenSeed", "gardenPetCage", "gardenTool"].includes(item.type)
    //       )
    //       .concat(plots.getAll().filter((plot) => !plot.isFavorite));
    //     if (!hasFavoriteTool) {
    //       return output.replyStyled(
    //         `❌ You need a Favorite Tool to favorite items! Buy one with ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }shop.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${UNISpectra.arrowFromT} Visit shop: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }shop`,
    //         style
    //       );
    //     }
    //     if (items.length === 0) {
    //       return output.replyStyled(
    //         `🌱 No items or crops to favorite! Check items with ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }list.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }plant\n` +
    //           `${UNISpectra.arrowFromT} Buy items: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }shop`,
    //         style
    //       );
    //     }

    //     if (!spectralArgs[0]) {
    //       return output.replyStyled(
    //         `❌ Specify an item or crop key to favorite! Check items with ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }list.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }plant\n` +
    //           `${UNISpectra.arrowFromT} Buy items: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }shop`,
    //         style
    //       );
    //     }

    //     let itemsTarget: (GardenItem | GardenPlot)[];

    //     itemsTarget = [
    //       ...plots.get(spectralArgs[0]),
    //       ...new Inventory<GardenItem>(items as GardenItem[]).get(
    //         spectralArgs[0]
    //       ),
    //     ];
    //     if (itemsTarget.length === 0) {
    //       return output.replyStyled(
    //         `❌ Invalid item key "${
    //           spectralArgs[0]
    //         }"! Check items with ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }plots.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }list`,
    //         style
    //       );
    //     }

    //     itemsTarget.forEach((i) => (i.isFavorite = true));
    //     await money.setItem(input.senderID, {
    //       inventory: Array.from(inventory),
    //       gardenPlots: Array.from(plots),
    //     });

    //     return ctx.output.replyStyled(
    //       `⭐ Favorited ${itemsTarget[0].icon} **${items[0].name}**! It won't be sold in bulk sales.\n\n` +
    //         `**Next Steps**:\n` +
    //         `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }list\n` +
    //         `${UNISpectra.arrowFromT} Unfavorite: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }unfavorite\n` +
    //         `${UNISpectra.arrowFromT} Sell items: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }sell`,
    //       style
    //     );
    //   },
    // },
    // {
    //   key: "unfavorite",
    //   description: "Remove favorite tag from an item or crop",
    //   aliases: ["-uf"],
    //   args: ["[item_key]"],
    //   async handler(_, { spectralArgs }) {
    //     const inventory = new Inventory<GardenItem | InventoryItem>(
    //       rawInventory
    //     );
    //     const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);

    //     const items = inventory
    //       .getAll()
    //       .filter((item) => item.isFavorite)
    //       .concat(plots.getAll().filter((plot) => plot.isFavorite));

    //     if (items.length === 0) {
    //       return output.replyStyled(
    //         `⭐ Nothing is currently favorited.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${
    //             UNISpectra.arrowFromT
    //           } Favorite something: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }favorite`,
    //         style
    //       );
    //     }

    //     if (!spectralArgs[0]) {
    //       return output.replyStyled(
    //         `❌ Please specify an item or crop key to unfavorite.\n\n` +
    //           `**Next Steps**:\n` +
    //           `${
    //             UNISpectra.arrowFromT
    //           } List favorites: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }list`,
    //         style
    //       );
    //     }

    //     const itemsTarget: (GardenItem | GardenPlot)[] = [
    //       ...plots.get(spectralArgs[0]).filter((p) => p.isFavorite),
    //       ...new Inventory<GardenItem>(items as GardenItem[]).get(
    //         spectralArgs[0]
    //       ),
    //     ];

    //     if (itemsTarget.length === 0) {
    //       return output.replyStyled(
    //         `❌ No favorited item found for key "${spectralArgs[0]}".\n\n` +
    //           `**Next Steps**:\n` +
    //           `${
    //             UNISpectra.arrowFromT
    //           } List favorites: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }list`,
    //         style
    //       );
    //     }

    //     itemsTarget.forEach((i) => (i.isFavorite = false));

    //     await money.setItem(input.senderID, {
    //       inventory: Array.from(inventory),
    //       gardenPlots: Array.from(plots),
    //     });

    //     return output.replyStyled(
    //       `🔓 Unfavorited ${itemsTarget[0].icon} **${itemsTarget[0].name}** — it can now be sold.\n\n` +
    //         `**Next Steps**:\n` +
    //         `${UNISpectra.arrowFromT} Sell items: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }sell\n` +
    //         `${UNISpectra.arrowFromT} Favorite again: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }favorite`,
    //       style
    //     );
    //   },
    // },
    {
      key: "uncage",
      description: "Uncage a pet to make it active",
      aliases: ["-u"],
      args: ["[pet_key]"],
      async handler(_, { spectralArgs }) {
        const inventory = new Inventory<GardenItem | InventoryItem>(
          rawInventory
        );
        const pets = new Inventory<GardenPetActive>(rawPets, PET_LIMIT);
        const equippedPets = pets
          .getAll()
          .filter((pet) => pet.isEquipped).length;
        const cagedPets = inventory
          .getAll()
          .filter(
            (item): item is GardenPetCage => item.type === "gardenPetCage"
          );
        if (equippedPets >= PET_EQUIP_LIMIT) {
          return output.replyStyled(
            `🐾 Max ${PET_EQUIP_LIMIT} equipped pets! Unequip or sell pets first.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }pets\n` +
              `${UNISpectra.arrowFromT} Sell pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }sell`,
            style
          );
        }
        if (cagedPets.length === 0) {
          return output.replyStyled(
            `🐾 No caged pets! Buy some with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }shop.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Visit shop: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop\n` +
              `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list`,
            style
          );
        }

        if (!spectralArgs[0]) {
          return output.replyStyled(
            `❌ Specify a pet key to uncage! Check items with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Buy items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }

        let cagedPet: GardenPetCage;

        const selected = inventory.getOne(spectralArgs[0]);
        if (!selected || selected.type !== "gardenPetCage") {
          return output.replyStyled(
            `❌ Invalid pet key "${
              spectralArgs[0]
            }"! Check caged pets with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list\n` +
              `${UNISpectra.arrowFromT} Buy pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }
        cagedPet = selected as GardenPetCage;

        if (pets.has(cagedPet.key)) {
          return ctx.output.replyStyled(
            "🐾 You cannot have this pet again.",
            style
          );
        }

        inventory.deleteOne(cagedPet.key);
        const isEquipped = equippedPets < 3;
        pets.addOne({
          ...cagedPet,
          key: cagedPet.key,
          name: cagedPet.petData.name,
          icon: cagedPet.icon,
          lastCollect: Date.now(),
          petData: cagedPet.petData,
          isEquipped,
        });

        await money.setItem(input.senderID, {
          inventory: Array.from(inventory),
          gardenPets: Array.from(pets),
        });

        return ctx.output.replyStyled(
          `🐾 Uncaged ${cagedPet.icon} **${cagedPet.name}**! It's now ${
            isEquipped
              ? "equipped and collecting seeds"
              : "active but not equipped"
          }.\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }pets\n` +
            `${UNISpectra.arrowFromT} Equip pets: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }pets`,
          style
        );
      },
    },
    {
      key: "pets",
      description: "View and manage active garden pets",
      aliases: ["-pt"],
      args: ["[equip/unequip/<page>] [pet_key]"],
      async handler(_, { spectralArgs }) {
        const pets = new Inventory<GardenPetActive>(rawPets, PET_LIMIT);
        let inventory = new Inventory<GardenItem | InventoryItem>(rawInventory);
        const page = parseInt(spectralArgs[0]) || 1;
        const action = spectralArgs[0];
        const petKey = spectralArgs[1];
        const equippedPets = pets
          .getAll()
          .filter((pet) => pet.isEquipped).length;

        if (action === "equip" && petKey) {
          const pet = pets.getOne(petKey);
          if (!pet) {
            return output.replyStyled(
              `❌ Invalid pet key "${petKey}"! Check pets with ${prefix}${commandName}${
                isHypen ? "-" : " "
              }pets.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }pets`,
              style
            );
          }
          if (equippedPets >= PET_EQUIP_LIMIT) {
            return output.replyStyled(
              `❌ Max ${PET_EQUIP_LIMIT} equipped pets! Unequip a pet first.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }pets`,
              style
            );
          }
          pet.isEquipped = true;
          await money.setItem(input.senderID, { gardenPets: Array.from(pets) });
          return output.replyStyled(
            `🐾 Equipped ${pet.icon} **${pet.name}**! It's now collecting seeds.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }pets`,
            style
          );
        } else if (action === "unequip" && petKey) {
          const pet = pets.getOne(petKey);
          if (!pet) {
            return output.replyStyled(
              `❌ Invalid pet key "${petKey}"! Check pets with ${prefix}${commandName}${
                isHypen ? "-" : " "
              }pets.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }pets`,
              style
            );
          }
          pet.isEquipped = false;
          await money.setItem(input.senderID, { gardenPets: Array.from(pets) });
          return output.replyStyled(
            `🐾 Unequipped ${pet.icon} **${pet.name}**! It's no longer collecting seeds.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} View pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }pets`,
            style
          );
        }

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = page * ITEMS_PER_PAGE;
        const currentPets = pets.getAll().slice(start, end);
        let result = `🐾 **${name}'s Active Pets (Page ${page})**:\n\n`;
        if (currentPets.length === 0) {
          return output.replyStyled(
            `🐾 No active pets! Uncage some with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }uncage.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Uncage pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }uncage\n` +
              `${
                UNISpectra.arrowFromT
              } Buy caged pets: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }

        let totalSeedsCollected = 0;
        let finalCollected: GardenItem[] = [];
        currentPets.forEach((pet, index) => {
          const {
            collections,
            collected,
            inventory: rInv,
          } = updatePetCollection(pet, inventory as Inventory<GardenItem>, ctx);
          inventory = rInv;
          finalCollected.push(...collected);
          totalSeedsCollected += collections;
          totalSeedsCollected = Math.min(
            global.Cassidy.invLimit,
            totalSeedsCollected
          );
          result +=
            `${start + index + 1}. ${pet.icon} **${pet.name}**${
              pet.isEquipped ? ` (Equipped)` : ""
            }\n` +
            `${UNIRedux.charm} Collects: ${pet.petData.seedTypes.join(
              ", "
            )}\n` +
            `${UNIRedux.charm} Rate: ${pet.petData.collectionRate} seeds/min${
              collections > 0 ? ` (+${collections} seeds)` : ""
            }\n\n`;
        });

        await money.setItem(input.senderID, {
          inventory: Array.from(inventory),
          gardenPets: Array.from(pets),
        });
        const finalCollInv = new Inventory(finalCollected);

        result +=
          `🌱 Total Seeds Collected: **${totalSeedsCollected}${
            totalSeedsCollected > 0 ? ` (+${totalSeedsCollected})` : ""
          }**\n\n` +
          `${finalCollInv
            .toUnique()
            .map(
              (s) =>
                `**x${finalCollInv.getAmount(s.key)}** ${s.icon} **${
                  s.name
                }** (Key: **${s.key}**)`
            )
            .join("\n")}\n\n` +
          `**Next Steps**:\n` +
          `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }list\n` +
          `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }plant\n` +
          `${UNISpectra.arrowFromT} Uncage more: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }uncage`;

        return output.replyStyled(result, style);
      },
    },
    {
      key: "steal",
      description: "Steal a crop from another player's garden",
      aliases: ["-st"],
      args: ["[player_id]"],
      async handler(_, { spectralArgs }) {
        const stealCost = 5;
        const userGems = collectibles.getAmount("gems");
        if (userGems < stealCost) {
          return output.replyStyled(
            `❌ You need ${formatValue(
              stealCost,
              "💎",
              true
            )} to steal a crop! Your gems: ${formatValue(
              userGems,
              "💎",
              true
            )}.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Sell crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }sell\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest`,
            style
          );
        }
        if (!spectralArgs[0]) {
          return output.replyStyled(
            `❌ Please specify a player ID to steal from!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Try again: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }steal [player_id]`,
            style
          );
        }
        const target = await money.getCache(spectralArgs[0]);
        const targetPlots = new Inventory<GardenPlot>(target.gardenPlots || []);
        const stealablePlots = targetPlots
          .getAll()
          .filter((plot) => isCropReady(plot) && !plot.isFavorite);
        if (stealablePlots.length === 0) {
          return output.replyStyled(
            `❌ No stealable crops in that player's garden!\n\n` +
              `**Next Steps**:\n` +
              `${
                UNISpectra.arrowFromT
              } Try another player: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }steal [player_id]`,
            style
          );
        }

        const stealSuccess = Math.random() > 0.3;
        if (!stealSuccess) {
          await money.setItem(input.senderID, { money: userMoney + 100 });
          return output.replyStyled(
            `❌ Steal failed for ${formatValue(
              stealCost,
              "💎",
              true
            )}! You received ${formatCash(100)} as compensation.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Try again: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }steal [player_id]\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest`,
            style
          );
        }

        const stolenPlot =
          stealablePlots[Math.floor(Math.random() * stealablePlots.length)];
        let inventory = new Inventory<GardenItem | InventoryItem>(rawInventory);
        const shopItem = gardenShop.itemData.find(
          (item) => item.key === stolenPlot.seedKey
        );
        if (shopItem && inventory.size() < global.Cassidy.invLimit) {
          const cache = inventory.getAll();
          shopItem.onPurchase({ ...ctx, moneySet: { inventory: cache } });
          inventory = new Inventory(cache);
        }
        targetPlots.deleteRef(stolenPlot);
        collectibles.raise("gems", -stealCost);
        await money.setItem(input.senderID, {
          collectibles: Array.from(collectibles),
          inventory: Array.from(inventory),
        });
        await money.setItem(spectralArgs[0], {
          gardenPlots: Array.from(targetPlots),
        });

        return output.replyStyled(
          `✅ Stole ${stolenPlot.icon} **${stolenPlot.name}**${
            stolenPlot.mutation ? ` (${stolenPlot.mutation})` : ""
          } for ${formatValue(stealCost, "💎", true)}!\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list\n` +
            `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant`,
          style
        );
      },
    },
    /*{
      key: "gift",
      description: "Gift an item or crop to another player",
      aliases: ["-g"],
      args: ["[player_id] [item_key]"],
      async handler(_, { spectralArgs }) {
        if (!allowGifting) {
          return output.replyStyled(
            `❌ Gifting is disabled in your settings!\n\n` +
              `**Next Steps**:\n` +
              `${
                UNISpectra.arrowFromT
              } Enable gifting: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }settings gifting on`,
            style
          );
        }
        if (!spectralArgs[0] || !spectralArgs[1]) {
          return output.replyStyled(
            `❌ Please specify a player ID and item key!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Try again: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }gift [player_id] [item_key]\n` +
              `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list`,
            style
          );
        }
        const inventory = new Inventory<GardenItem | InventoryItem>(
          rawInventory
        );
        const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        const item =
          inventory.getOne(spectralArgs[1]) || plots.getOne(spectralArgs[1]);
        if (!item) {
          return output.replyStyled(
            `❌ Invalid item key "${
              spectralArgs[1]
            }"! Check items with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list`,
            style
          );
        }

        const target = await money.getCache(spectralArgs[0]);
        const targetInventory = new Inventory<GardenItem | InventoryItem>(
          target.inventory || []
        );
        if (targetInventory.size() >= global.Cassidy.invLimit) {
          return output.replyStyled(
            `❌ The player's inventory is full!\n\n` +
              `**Next Steps**:\n` +
              `${
                UNISpectra.arrowFromT
              } Try another player: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }gift [player_id] [item_key]`,
            style
          );
        }

        if (item.type === "activePlot") {
          plots.deleteOne(item.key);
          targetInventory.addOne(item);
        } else {
          inventory.deleteOne(item.key);
          targetInventory.addOne(item);
        }
        await money.setItem(input.senderID, {
          inventory: Array.from(inventory),
          gardenPlots: Array.from(plots),
        });
        await money.setItem(spectralArgs[0], {
          inventory: Array.from(targetInventory),
        });

        return output.replyStyled(
          `🎁 Gifted ${item.icon} **${item.name}** to player ${spectralArgs[0]}!\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list\n` +
            `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant`,
          style
        );
      },
    },*/
    {
      key: "growall",
      description: "Instantly grow all crops",
      aliases: ["-ga"],
      async handler() {
        const growAllCost = 100;
        const userGems = collectibles.getAmount("gems");
        if (userGems < growAllCost) {
          return output.replyStyled(
            `❌ You need ${formatValue(
              growAllCost,
              "💎",
              true
            )} to grow all crops! Your gems: ${formatValue(
              userGems,
              "💎",
              true
            )}.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Sell crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }sell\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest`,
            style
          );
        }
        const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        if (plots.getAll().length === 0) {
          return output.replyStyled(
            `🌱 No crops to grow! Plant seeds with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant.\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Buy seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }shop`,
            style
          );
        }

        plots.getAll().forEach((plot) => {
          plot.plantedAt = 0;
        });
        collectibles.raise("gems", -growAllCost);
        await money.setItem(input.senderID, {
          gardenPlots: Array.from(plots),
          collectibles: Array.from(collectibles),
        });

        return output.replyStyled(
          `🌱 All crops grown instantly for ${formatValue(
            growAllCost,
            "💎",
            true
          )}!\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }harvest\n` +
            `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plots`,
          style
        );
      },
    },
    {
      key: "expand",
      description: "Expand your garden plot",
      aliases: ["-ex"],
      args: ["[side/rear1/rear2]"],
      async handler(_, { spectralArgs }) {
        const sideExpansionCost = 250000000;
        const rearExpansion1Cost = 500000000;
        const rearExpansion2Cost = 1000000000;
        const sideExpansionPlots = 8;
        const rearExpansionPlots = 12;
        const sideExpansionDelay = 0;
        const rearExpansion1Delay = 24 * 60 * 60 * 1000;
        const rearExpansion2Delay = 3 * 24 * 60 * 60 * 1000;
        const currentTime = Date.now();

        if (plotLimit >= PLOT_EXPANSION_LIMIT) {
          return output.replyStyled(
            `🌱 Max plot limit (${PLOT_EXPANSION_LIMIT}) reached!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Harvest crops: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }harvest\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant`,
            style
          );
        }

        const expansionType = spectralArgs[0];
        if (!expansionType) {
          return output.replyStyled(
            `❌ Invalid expansion type! Use: side, rear1, or rear2.\n\n` +
              `💰 **Costs**:\n\nSide - ${formatCash(
                sideExpansionCost,
                true
              )}\nRear1 - ${formatCash(
                rearExpansion1Cost,
                true
              )}\nRear2 - ${formatCash(rearExpansion2Cost, true)}\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Try again: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }expand [side/rear1/rear2]`,
            style
          );
        }

        if (expansionType === "side") {
          if (userMoney < sideExpansionCost) {
            return output.replyStyled(
              `❌ You need ${formatCash(
                sideExpansionCost
              )} for a side expansion! Your balance: ${formatCash(
                userMoney
              )}.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} Sell crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }sell\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          if (currentTime - lastSideExpansion < sideExpansionDelay) {
            return output.replyStyled(
              `⏳ Side expansion on cooldown! Try again in ${
                formatTimeSentence(
                  lastSideExpansion + sideExpansionDelay - currentTime
                ) || "Now?"
              }.\n\n` +
                `**Next Steps**:\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          await money.setItem(input.senderID, {
            money: userMoney - sideExpansionCost,
            plotLimit: plotLimit + sideExpansionPlots,
            lastSideExpansion: currentTime,
            gardenStats: {
              ...gardenStats,
              expansions: (gardenStats.expansions || 0) + 1,
            },
          });
          await checkAchievements(
            {
              ...ctx.user,
              gardenStats: {
                ...gardenStats,
                expansions: (gardenStats.expansions || 0) + 1,
              },
              senderID: input.senderID,
              money: userMoney - sideExpansionCost,
            },
            money,
            output,
            input
          );
          return output.replyStyled(
            `🌱 Plot expanded by ${sideExpansionPlots} slots for ${formatCash(
              sideExpansionCost
            )}!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plots`,
            style
          );
        } else if (expansionType === "rear1") {
          if (userMoney < rearExpansion1Cost) {
            return output.replyStyled(
              `❌ You need ${formatCash(
                rearExpansion1Cost
              )} for the first rear expansion! Your balance: ${formatCash(
                userMoney
              )}.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} Sell crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }sell\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          if (currentTime - lastRearExpansion1 < rearExpansion1Delay) {
            return output.replyStyled(
              `⏳ First rear expansion on cooldown! Try again in ${
                formatTimeSentence(
                  lastRearExpansion1 + rearExpansion1Delay - currentTime
                ) || "Now?"
              }.\n\n` +
                `**Next Steps**:\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          await money.setItem(input.senderID, {
            money: userMoney - rearExpansion1Cost,
            plotLimit: plotLimit + rearExpansionPlots,
            lastRearExpansion1: currentTime,
            gardenStats: {
              ...gardenStats,
              expansions: (gardenStats.expansions || 0) + 1,
            },
          });
          await checkAchievements(
            {
              ...ctx.user,
              gardenStats: {
                ...gardenStats,
                expansions: (gardenStats.expansions || 0) + 1,
              },
              senderID: input.senderID,
              money: userMoney - rearExpansion1Cost,
            },
            money,
            output,
            input
          );
          return output.replyStyled(
            `🌱 Plot expanded by ${rearExpansionPlots} slots for ${formatCash(
              rearExpansion1Cost
            )}!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plots`,
            style
          );
        } else if (expansionType === "rear2") {
          if (userMoney < rearExpansion2Cost) {
            return output.replyStyled(
              `❌ You need ${formatCash(
                rearExpansion2Cost
              )} for the second rear expansion! Your balance: ${formatCash(
                userMoney
              )}.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} Sell crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }sell\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          if (currentTime - lastRearExpansion2 < rearExpansion2Delay) {
            return output.replyStyled(
              `⏳ Second rear expansion on cooldown! Try again in ${
                formatTimeSentence(
                  lastRearExpansion2 + rearExpansion2Delay - currentTime
                ) || "Now?"
              }.\n\n` +
                `**Next Steps**:\n` +
                `${
                  UNISpectra.arrowFromT
                } Harvest crops: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }harvest`,
              style
            );
          }
          await money.setItem(input.senderID, {
            money: userMoney - rearExpansion2Cost,
            plotLimit: plotLimit + rearExpansionPlots,
            lastRearExpansion2: currentTime,
            gardenStats: {
              ...gardenStats,
              expansions: (gardenStats.expansions || 0) + 1,
            },
          });
          await checkAchievements(
            {
              ...ctx.user,
              gardenStats: {
                ...gardenStats,
                expansions: (gardenStats.expansions || 0) + 1,
              },
              senderID: input.senderID,
              money: userMoney - rearExpansion2Cost,
            },
            money,
            output,
            input
          );
          return output.replyStyled(
            `🌱 Plot expanded by ${rearExpansionPlots} slots for ${formatCash(
              rearExpansion2Cost
            )}!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plant\n` +
              `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plots`,
            style
          );
        } else {
          return output.replyStyled(
            `❌ Invalid expansion type! Use: side, rear1, or rear2.\n\n` +
              `💰 **Costs**:\n\nSide - ${formatCash(
                sideExpansionCost,
                true
              )}\nRear1 - ${formatCash(
                rearExpansion1Cost,
                true
              )}\nRear2 - ${formatCash(rearExpansion2Cost, true)}\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} Try again: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }expand [side/rear1/rear2]`,
            style
          );
        }
      },
    },
    /*{
      key: "sell",
      description: "Sell items or crops at Steven's Stand",
      aliases: ["-s"],
      args: ["[item_key/inventory]"],
      async handler(_, { spectralArgs }) {
        const inventory = new Inventory<GardenItem | InventoryItem>(
          rawInventory
        );
        const plots = new Inventory<GardenPlot>(rawPlots, plotLimit);
        let moneyEarned = 0;
        const sold: string[] = [];

        if (spectralArgs[0] === "inventory") {
          const sellableItems = inventory
            .getAll()
            .filter((item) => !item.isFavorite);
          if (sellableItems.length === 0) {
            return output.replyStyled(
              `❌ No sellable items in inventory! Favorite items are protected.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }list\n` +
                `${
                  UNISpectra.arrowFromT
                } Favorite items: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }favorite`,
              style
            );
          }
          sellableItems.forEach((item) => {
            moneyEarned += item.sellPrice;
            sold.push(
              `${item.icon} ${item.name} - ${formatCash(item.sellPrice)}`
            );
            inventory.deleteOne(item.key);
          });
        } else if (spectralArgs[0]) {
          const item =
            inventory.getOne(spectralArgs[0]) || plots.getOne(spectralArgs[0]);
          if (!item) {
            return output.replyStyled(
              `❌ Invalid item key "${
                spectralArgs[0]
              }"! Check items with ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list.\n\n` +
                `**Next Steps**:\n` +
                `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }list\n` +
                `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }plots`,
              style
            );
          }
          if (item.isFavorite) {
            return output.replyStyled(
              `❌ Cannot sell favorited item ${item.icon} **${item.name}**!\n\n` +
                `**Next Steps**:\n` +
                `${
                  UNISpectra.arrowFromT
                } Unfavorite item: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }favorite\n` +
                `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
                  isHypen ? "-" : " "
                }list`,
              style
            );
          }
          moneyEarned +=
            item.sellPrice ||
            calculateCropValue(
              item as GardenPlot,
              plots,
              gardenStats.expansions
            );
          sold.push(
            `${item.icon} ${item.name} - ${formatCash(
              item.sellPrice ||
                calculateCropValue(
                  item as GardenPlot,
                  plots,
                  gardenStats.expansions
                )
            )}`
          );
          if (item.type === "activePlot") {
            plots.deleteOne(item.key);
          } else {
            inventory.deleteOne(item.key);
          }
        } else {
          return output.replyStyled(
            `❌ Please specify an item key or "inventory"!\n\n` +
              `**Next Steps**:\n` +
              `${UNISpectra.arrowFromT} List items: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }list\n` +
              `${UNISpectra.arrowFromT} Check plots: ${prefix}${commandName}${
                isHypen ? "-" : " "
              }plots`,
            style
          );
        }

        await money.setItem(input.senderID, {
          money: userMoney + moneyEarned,
          inventory: Array.from(inventory),
          gardenPlots: Array.from(plots),
        });

        return output.replyStyled(
          `💰 **Sold at Steven's Stand**:\n${sold.join("\n")}\n\n` +
            `💰 Earned: ${formatCash(moneyEarned)}\n` +
            `💵 Balance: ${formatCash(userMoney + moneyEarned)}\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }list\n` +
            `${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant`,
          style
        );
      },
    },*/
    {
      key: "event",
      description: "Check current garden event or weather",
      aliases: ["-e"],
      async handler() {
        const event = getCurrentEvent();
        const result = [
          `🌦️ **Current Event&Weather**: ${event.icon} ${event.name}`,
          `${UNIRedux.charm} Mutation Chance: +${(
            event.effect.mutationChance * 100
          ).toFixed(0)}%`,
          `${UNIRedux.charm} Growth Speed: ${event.effect.growthMultiplier}x`,
        ];
        if (event.effect.mutationType) {
          result.push(
            `${UNIRedux.charm} Mutation Type: ${event.effect.mutationType}`
          );
        }

        const timeLeft = getTimeForNextEvent();
        result.push(
          `🕒 Next Event in: ${formatTimeSentence(timeLeft) || "Ready!"}`
        );

        result.push(
          `\n**Next Steps**:\n${
            UNISpectra.arrowFromT
          } Buy event seeds: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }shop\n${UNISpectra.arrowFromT} Plant seeds: ${prefix}${commandName}${
            isHypen ? "-" : " "
          }plant`
        );

        return output.replyStyled(result.join("\n"), style);
      },
    },
    // {
    //   key: "settings",
    //   description: "Manage garden settings",
    //   aliases: ["-set"],
    //   args: ["gifting [on/off]"],
    //   async handler(_, { spectralArgs }) {
    //     if (
    //       !spectralArgs[0] ||
    //       spectralArgs[0] !== "gifting" ||
    //       !["on", "off"].includes(spectralArgs[1])
    //     ) {
    //       return output.replyStyled(
    //         `❌ Specify setting: ${prefix}${commandName} settings gifting [on/off]\n\n` +
    //           `**Current Settings**:\n` +
    //           `${UNIRedux.charm} Gifting: ${
    //             allowGifting ? "Enabled" : "Disabled"
    //           }\n\n` +
    //           `**Next Steps**:\n` +
    //           `${
    //             UNISpectra.arrowFromT
    //           } Toggle gifting: ${prefix}${commandName}${
    //             isHypen ? "-" : " "
    //           }settings gifting [on/off]`,
    //         style
    //       );
    //     }

    //     const newGiftingSetting = spectralArgs[1] === "on";
    //     await money.setItem(input.senderID, {
    //       allowGifting: newGiftingSetting,
    //     });

    //     return output.replyStyled(
    //       `✅ Gifting ${newGiftingSetting ? "enabled" : "disabled"}!\n\n` +
    //         `**Next Steps**:\n` +
    //         `${UNISpectra.arrowFromT} Gift items: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }gift\n` +
    //         `${UNISpectra.arrowFromT} Check items: ${prefix}${commandName}${
    //           isHypen ? "-" : " "
    //         }list`,
    //       style
    //     );
    //   },
    // },
    {
      key: "guide",
      description: "Learn how to play Grow a Garden",
      aliases: ["-g"],
      async handler() {
        return output.replyStyled(
          `🌱 **Grow a Garden Guide** 🌱\n\n` +
            `Welcome, ${name}! Grow crops, manage pets, and earn Money in your garden!\n\n` +
            `**How to Play**:\n` +
            `${
              UNIRedux.charm
            } **Shop**: Buy seeds, pets, and tools at Sam's Garden Shop with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }shop.\n` +
            `${
              UNIRedux.charm
            } **Plant**: Plant seeds in up to ${plotLimit} plots with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plant. Multi-harvest crops yield multiple times.\n` +
            `${
              UNIRedux.charm
            } **Harvest**: Collect crops for Money with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }harvest. 5% chance to get a seed (Lucky Harvest).\n` +
            `${UNIRedux.charm} **Mutations**: Crops may mutate (e.g., Wet, Shocked), boosting value. Affected by weather, tools, and pets.\n` +
            `${
              UNIRedux.charm
            } **Pets**: Uncage pets with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }uncage to collect seeds (up to ${PET_EQUIP_LIMIT} equipped).\n` +
            `${UNIRedux.charm} **Tools**: Sprinkler and Fertilizer boost growth and mutations. Favorite Tool protects items.\n` +
            `${UNIRedux.charm} **Events**: Weekly weather/events (e.g., ${EVENT_CONFIG.EVENTS[0].name}) offer exclusive seeds and bonuses.\n` +
            `${
              UNIRedux.charm
            } **Favoriting**: Use Favorite Tool to mark items/crops with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }favorite to prevent selling.\n` +
            `${
              UNIRedux.charm
            } **Stealing**: Steal crops from others for ${formatCash(
              1000
            )} with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }steal (70% success).\n` +
            `${
              UNIRedux.charm
            } **Gifting**: Gift items/crops with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }gift. Toggle with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }settings.\n` +
            `${
              UNIRedux.charm
            } **Grow All**: Instantly grow all crops for ${formatCash(
              5000
            )} with ${prefix}${commandName}${isHypen ? "-" : " "}growall.\n` +
            `${
              UNIRedux.charm
            } **Expand**: Add plots with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }expand (costs ${formatCash(250000000)}-${formatCash(
              1000000000
            )}).\n` +
            `${
              UNIRedux.charm
            } **Sell**: Sell items/crops at Steven's Stand with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }sell.\n\n` +
            `**Tips**:\n` +
            `- Check events with ${prefix}${commandName}${
              isHypen ? "-" : " "
            }event for bonuses.\n` +
            `- Use tools to speed up growth and get rare mutations.\n` +
            `- Favorite valuable items to avoid accidental sales.\n` +
            `- Expand your plot to grow more crops at once!\n\n` +
            `**Next Steps**:\n` +
            `${UNISpectra.arrowFromT} Start shopping: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }shop\n` +
            `${UNISpectra.arrowFromT} View plots: ${prefix}${commandName}${
              isHypen ? "-" : " "
            }plots`,
          style
        );
      },
    },
  ]);

  await home.runInContext(ctx);
}

export const style: CassidySpectra.CommandStyle = {
  title: {
    content: `${UNISpectra.charm} **G🍅rden**`,
    text_font: "fancy",
    line_bottom: "default",
  },
  contentFont: "fancy",
  footer: {
    content: "Rewards multiply with success.",
    text_font: "fancy",
  },
};
