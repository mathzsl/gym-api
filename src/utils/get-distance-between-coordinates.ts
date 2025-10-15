export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate
): number {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}
