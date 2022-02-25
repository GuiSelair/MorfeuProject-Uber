import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';

import Search from '../Search';
import Directions from '../Directions';
import Marker from '../Marker';
import MapboxLog from '../../config/MapboxLog';
import MapboxAuth from '../../config/MapboxAuth';
import { ICoordinatesObject } from '../../dtos/ICoordinantes';
import { getPixelSize } from '../../utils/getPixelSize';

MapboxGL.setAccessToken(MapboxAuth.accessKey);
MapboxLog.disableCustomLog();

const Map = () => {
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const [currentLocation, setCurrentLocation] = useState<ICoordinatesObject>(
    {} as ICoordinatesObject,
  );
  const [destinationLocation, setDestinationLocation] =
    useState<ICoordinatesObject>({} as ICoordinatesObject);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCurrentLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
      },
    );
  }, []);

  const handleLocationSelected = useCallback(
    (coordinates: ICoordinatesObject) => {
      setDestinationLocation(coordinates);
    },
    [],
  );

  return (
    <>
      <MapboxGL.MapView
        style={styles.mapContainer}
        styleURL={MapboxGL.StyleURL.Street}
        ref={mapViewRef}
        rotateEnabled={false}>
        <MapboxGL.Camera
          centerCoordinate={[
            currentLocation.longitude,
            currentLocation.latitude,
          ]}
          ref={mapCameraRef}
          zoomLevel={16}
        />
        {!!Object.keys(destinationLocation).length && (
          <>
            <Marker
              destinationCoordinates={[
                destinationLocation.longitude,
                destinationLocation.latitude,
              ]}
            />
            <Directions
              startCoordinates={currentLocation}
              endCoordinates={destinationLocation}
              onReady={() => {
                mapCameraRef.current?.fitBounds(
                  [currentLocation.longitude, currentLocation.latitude],
                  [destinationLocation.longitude, destinationLocation.latitude],
                  getPixelSize(50),
                  1000,
                );
              }}
            />
          </>
        )}

        <MapboxGL.UserLocation />
      </MapboxGL.MapView>
      <Search onLocationSelected={handleLocationSelected} />
    </>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  textContainer: {
    zIndex: 1,
    elevation: 2,
  },
  text: {
    textAlign: 'center',
    flex: 1,
  },
});

export default Map;
