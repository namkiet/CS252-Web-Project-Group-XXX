import { useState, useCallback } from 'react';
import type { MapLocation } from '../components/map-area/simple-map';

export interface RoutePoint {
  id: string | number;
  lat: number;
  lng: number;
  name: string;
}

export interface RouteResponse {
  distance: number;
  duration: number;
  geometry: Array<[number, number]>;
  waypoints: Array<{ hint: string; distance: number; name: string; location: [number, number] }>;
}

export function useRoutePlanning() {
  const [userLocation, setUserLocation] = useState<RoutePoint | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<(string | number)[]>([]);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [routeSegments, setRouteSegments] = useState<Array<Array<[number, number]>>>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Get user location
  const getUserLocation = useCallback(() => {
    setIsLoadingRoute(true);
    setRouteError(null);

    if (!navigator.geolocation) {
      setRouteError('Browser does not support geolocation');
      setIsLoadingRoute(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          id: 'my-location',
          lat: latitude,
          lng: longitude,
          name: 'My Location',
        });
        setIsLoadingRoute(false);
      },
      (error) => {
        setRouteError(`Unable to get location: ${error.message}`);
        setIsLoadingRoute(false);
      }
    );
  }, []);

  // Toggle location vào route
  const toggleLocation = useCallback((locationId: string | number) => {
    setSelectedLocations((prev) => {
      if (prev.includes(locationId)) {
        return prev.filter((id) => id !== locationId);
      }
      return [...prev, locationId];
    });
  }, []);

  // Gọi OSRM API để tính route
  const calculateRoute = useCallback(
    async (locations: MapLocation[]) => {
      // Auto clear when nothing selected or no user location
      if (!userLocation || selectedLocations.length === 0) {
        setRouteData(null);
        setRouteSegments([]);
        return;
      }

      setIsLoadingRoute(true);
      setRouteError(null);

      try {
        // Tạo danh sách điểm: điểm bắt đầu + các điểm được chọn theo thứ tự
        const routePoints: Array<[number, number]> = [
          [userLocation.lng, userLocation.lat], // OSRM format: lng,lat
        ];

        // Thêm các điểm được toggle theo thứ tự
        selectedLocations.forEach((locId) => {
          const loc = locations.find((l) => l.id === locId);
          if (loc) {
            routePoints.push([loc.lng, loc.lat]);
          }
        });

        if (routePoints.length < 2) {
          setRouteData(null);
          setIsLoadingRoute(false);
          return;
        }

        // Call OSRM API
        const coordinates = routePoints.join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`;

        const response = await fetch(osrmUrl);
        if (!response.ok) {
          throw new Error('Unable to calculate route');
        }

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          // Build per-leg geometries (different color per segment)
          const legs = Array.isArray(route.legs) ? route.legs : [];
          const segments: Array<Array<[number, number]>> = [];

          if (legs.length > 0) {
            for (const leg of legs) {
              const steps = Array.isArray(leg.steps) ? leg.steps : [];
              const segCoords: Array<[number, number]> = [];
              for (const step of steps) {
                if (step.geometry && Array.isArray(step.geometry.coordinates)) {
                  segCoords.push(
                    ...((step.geometry.coordinates as Array<[number, number]>) || [])
                  );
                }
              }
              if (segCoords.length > 0) {
                segments.push(segCoords);
              }
            }
          }

          // Fallback: if segments empty, use the full overview geometry as single segment
          if (segments.length === 0 && route.geometry && Array.isArray(route.geometry.coordinates)) {
            segments.push(route.geometry.coordinates as Array<[number, number]>);
          }

          setRouteSegments(segments);

          setRouteData({
            distance: route.distance, // meters
            duration: route.duration, // seconds
            geometry: route.geometry.coordinates as Array<[number, number]>,
            waypoints: data.waypoints,
          });
        } else {
          setRouteSegments([]);
          setRouteData(null);
        }
      } catch (error) {
        setRouteError(
          error instanceof Error ? error.message : 'Error calculating route'
        );
        setRouteData(null);
        setRouteSegments([]);
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [userLocation, selectedLocations]
  );

  // Clear route
  const clearRoute = useCallback(() => {
    setSelectedLocations([]);
    setRouteData(null);
    setRouteSegments([]);
  }, []);

  return {
    userLocation,
    selectedLocations,
    routeData,
    routeSegments,
    isLoadingRoute,
    routeError,
    getUserLocation,
    toggleLocation,
    calculateRoute,
    clearRoute,
  };
}
