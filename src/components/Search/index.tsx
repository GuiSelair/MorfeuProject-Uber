import React, { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  FlatList,
  Text,
} from 'react-native';

import { ICoordinatesObject } from '../../dtos/ICoordinantes';
import MapboxAuth from '../../config/MapboxAuth';

type ICoordinates = [number, number];

interface IMapboxPlaces {
  text: string;
  place_name: string;
  center: ICoordinates;
  geometry: {
    type: 'Point';
    coordinates: ICoordinates;
  };
}

interface ISearch {
  onLocationSelected: (coordinates: ICoordinatesObject) => void;
}

const Search = ({ onLocationSelected }: ISearch) => {
  const [places, setPlaces] = useState<IMapboxPlaces[]>([]);
  const [showPlacesList, setShowPlacesList] = useState(false);

  const accessToken = MapboxAuth.accessKey;

  const handleInputChangeDebounced = useDebouncedCallback(value => {
    handleSearchPlace(value);
  }, 700);

  const handleSearchPlace = useCallback(
    async (place: string) => {
      const placeSanitized = place.replace(' ', '%20');

      const responseRaw = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSanitized}.json?access_token=${accessToken}&language=pt&autocomplete=true`,
      );

      const { features } = await responseRaw.json();

      setPlaces(features);
    },
    [accessToken],
  );

  const handleAddCoordinatesFromPlace = useCallback(
    (placeCoordinates: ICoordinates) => {
      onLocationSelected({
        latitude: placeCoordinates[1],
        longitude: placeCoordinates[0],
      });
      setShowPlacesList(false);
    },
    [onLocationSelected],
  );

  return (
    <View style={style.container}>
      <View style={style.textInputContainer}>
        <TextInput
          clearButtonMode="always"
          style={style.textInput}
          placeholder="Para onde?"
          onFocus={() => setShowPlacesList(true)}
          placeholderTextColor="#333"
          autoFocus={false}
          autoCapitalize="sentences"
          onChangeText={handleInputChangeDebounced}
        />
      </View>
      {showPlacesList && (
        <View style={style.listContainer}>
          <FlatList
            data={places}
            renderItem={({ item: place }) => (
              <Text
                style={style.row}
                onPress={() => handleAddCoordinatesFromPlace(place.center)}>
                {place.place_name}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 40 }),
    width: '100%',
  },
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    height: 54,
    marginHorizontal: 20,
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    height: 54,
    borderRadius: 4,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 18,
    color: '#333',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginTop: 4,
    marginHorizontal: 20,
    borderRadius: 4,
  },
  row: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default Search;
