import { Cryptocurrency } from 'crypto-dashboard-shared';
import { AddressModel } from '../../models/address';

const BIRDEYE_API_URL = 'https://public-api.birdeye.so/defi';
const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;

// In-memory cache with expiration
interface CacheEntry {
  price: number;
  timestamp: number;
}

const priceCache: Map<string, CacheEntry> = new Map();
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
const RATE_LIMIT_WINDOW = 1000; // 1 second between API calls
let lastApiCall = 0;

export async function getTokenPrice(address: string): Promise<Cryptocurrency | null> {
  try {
    // Check memory cache first
    const cachedPrice = priceCache.get(address);
    if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
      console.log('cached price from cache', cachedPrice);
      return {
        cryptoName: address,
        price: cachedPrice.price,
      };
    }

    // Check database cache
    const addressWithToken = await AddressModel.findOne({
      addressContent: {
        $elemMatch: {
          mintAddress: address,
          lastUpdated: { $gt: new Date(Date.now() - CACHE_DURATION) },
        },
      },
    });

    if (addressWithToken) {
      const token = addressWithToken.addressContent?.find((t) => t.mintAddress === address);
      if (token) {
        // Update memory cache from DB
        priceCache.set(address, {
          price: token.usdValue,
          timestamp: token.lastUpdated.getTime(),
        });
        console.log('cached price from db', priceCache.get(address));
        return {
          cryptoName: address,
          price: token.usdValue,
        };
      }
    }

    // Rate limiting
    const now = Date.now();
    const timeToWait = RATE_LIMIT_WINDOW - (now - lastApiCall);
    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
    lastApiCall = Date.now();

    // Fetch new price if not in cache or expired
    const response = await fetch(`${BIRDEYE_API_URL}/price?address=${address}`, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Birdeye API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data?.value) {
      return null;
    }

    // Update memory cache
    priceCache.set(address, {
      price: data.data.value,
      timestamp: Date.now(),
    });

    return {
      cryptoName: address,
      price: data.data.value,
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    // If API call fails, return cached value even if expired
    const cachedPrice = priceCache.get(address);
    if (cachedPrice) {
      return {
        cryptoName: address,
        price: cachedPrice.price,
      };
    }
    return null;
  }
}
