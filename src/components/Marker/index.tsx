import React from 'react';
import { View, Image } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

// import logo from '../../assets/marker.png';

interface IMarker {
  destinationCoordinates: number[];
}

const Marker = ({ destinationCoordinates }: IMarker) => {
  return (
    <View>
      <MapboxGL.PointAnnotation
        id="destinationMarker"
        coordinate={destinationCoordinates}>
        <View>
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png',
            }}
            width={30}
            height={30}
          />
        </View>
      </MapboxGL.PointAnnotation>
    </View>
  );
};

export default Marker;
