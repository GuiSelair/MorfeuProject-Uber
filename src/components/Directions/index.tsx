import React, { useState, useEffect } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';

import { ICoordinatesObject } from '../../dtos/ICoordinantes';
import MapboxAuth from '../../config/MapboxAuth';

interface IDirections {
  startCoordinates: ICoordinatesObject;
  endCoordinates: ICoordinatesObject;
  onReady: () => void;
}

interface IGeometryObject {
  coordinates: [number, number][];
  type: 'LineString';
}

interface IRoutes {
  distance: number;
  duration: number;
  geometry: IGeometryObject;
}

const Directions = ({
  startCoordinates,
  endCoordinates,
  onReady,
}: IDirections) => {
  const [routes, setRoutes] = useState<IRoutes[]>([]);

  useEffect(() => {
    if (!endCoordinates || !Object.keys(endCoordinates).length) {
      return;
    }

    const getDirectionsToDestination = async () => {
      const formattedCoordinatesToString = `${startCoordinates.longitude}%2C${startCoordinates.latitude}%3B${endCoordinates.longitude}%2C${endCoordinates.latitude}`;

      const responseRaw = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${formattedCoordinatesToString}?access_token=${MapboxAuth.accessKey}&alternatives=true&geometries=geojson`,
      );

      const { routes: alternativesRoutesToDestination } =
        await responseRaw.json();

      setRoutes(alternativesRoutesToDestination);
      onReady();
    };

    getDirectionsToDestination();
  }, [
    endCoordinates,
    startCoordinates.latitude,
    startCoordinates.longitude,
    onReady,
  ]);

  return (
    <>
      {!!routes[0] && (
        <MapboxGL.ShapeSource
          id="shapeSource"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routes[0].geometry.coordinates,
            },
            properties: {},
          }}>
          <MapboxGL.LineLayer
            id="lineLayer"
            style={{ lineWidth: 3, lineJoin: 'bevel', lineColor: '#222' }}
          />
        </MapboxGL.ShapeSource>
      )}
    </>
  );
};

export default Directions;
