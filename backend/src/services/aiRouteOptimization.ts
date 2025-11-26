import OpenAI from 'openai';
import { config } from '../config/env';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

interface RoutePoint {
  lat: number;
  lng: number;
  address: string;
}

interface RouteOptimizationResult {
  optimizedRoute: RoutePoint[];
  estimatedDistance: number;
  estimatedDuration: number;
  fuelEstimate: number;
  weatherWarnings: string[];
  trafficWarnings: string[];
  recommendations: string[];
  alternativeRoutes: Array<{
    distance: number;
    duration: number;
    description: string;
  }>;
}

export async function optimizeRoute(
  pickup: RoutePoint,
  dropoff: RoutePoint,
  truckType?: string
): Promise<RouteOptimizationResult> {
  try {
    const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
    const duration = Math.round(distance / 55 * 60);

    const prompt = `You are an AI logistics expert. Analyze this route and provide optimization recommendations:

Pickup: ${pickup.address} (${pickup.lat}, ${pickup.lng})
Dropoff: ${dropoff.address} (${dropoff.lat}, ${dropoff.lng})
Distance: ${distance.toFixed(2)} miles
Truck Type: ${truckType || 'Standard'}

Provide:
1. Fuel efficiency recommendations
2. Weather considerations (general seasonal advice)
3. Traffic optimization tips
4. Safety recommendations
5. Alternative route suggestions

Format as JSON with keys: fuelTips, weatherConsiderations, trafficTips, safetyAdvice, alternativeRouteIdeas`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || '{}';
    let aiData: any = {};

    try {
      aiData = JSON.parse(aiResponse);
    } catch {
      aiData = { recommendations: [aiResponse] };
    }

    const fuelEstimate = (distance / 6.5) * 3.5;

    return {
      optimizedRoute: [pickup, dropoff],
      estimatedDistance: distance,
      estimatedDuration: duration,
      fuelEstimate,
      weatherWarnings: aiData.weatherConsiderations || [],
      trafficWarnings: aiData.trafficTips || [],
      recommendations: [
        ...(aiData.fuelTips || []),
        ...(aiData.safetyAdvice || []),
        ...(aiData.recommendations || []),
      ],
      alternativeRoutes: aiData.alternativeRouteIdeas?.map((idea: string, idx: number) => ({
        distance: distance * (1 + (idx * 0.1)),
        duration: duration * (1 + (idx * 0.15)),
        description: idea,
      })) || [],
    };
  } catch (error) {
    console.error('Route optimization error:', error);

    const distance = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
    const duration = Math.round(distance / 55 * 60);

    return {
      optimizedRoute: [pickup, dropoff],
      estimatedDistance: distance,
      estimatedDuration: duration,
      fuelEstimate: (distance / 6.5) * 3.5,
      weatherWarnings: [],
      trafficWarnings: [],
      recommendations: ['Direct route recommended'],
      alternativeRoutes: [],
    };
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export async function calculateETA(
  currentLat: number,
  currentLng: number,
  destinationLat: number,
  destinationLng: number,
  averageSpeed: number = 55
): Promise<{
  eta: Date;
  remainingDistance: number;
  remainingTime: number;
}> {
  const distance = calculateDistance(currentLat, currentLng, destinationLat, destinationLng);
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);

  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + timeInMinutes);

  return {
    eta,
    remainingDistance: distance,
    remainingTime: timeInMinutes,
  };
}
