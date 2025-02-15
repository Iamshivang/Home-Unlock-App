import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';


const APIKEY = 'AlzaSyFekZ7Z3ghTisBNokieav8HIaDtpQ0MjDA';

const HomeScreen = (props) => {
  const [data, setData] = useState([]);
  const [addresses, setAddresses] = useState({});
  useEffect(() => {
    getData();
  }, []);


  const getData = async () => {
    const url = 'https://678f678849875e5a1a91b27f.mockapi.io/houses';
    let result = await fetch(url);
    result = await result.json();
    setData(result);


    result.forEach(async (item) => {
      const address = await getAddressFromCoordinates(item.latitude, item.longitude);
      setAddresses(prev => ({ ...prev, [item.id]: address }));
    });
  };


  const getAddressFromCoordinates = async (latStr, lngStr) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return 'Invalid coordinates';
    }

    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${lat},${lng}&key=${APIKEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('GoMaps API Error:', error);
      return 'Error fetching address';
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.heading}>Houses</Text>

      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => props.navigation.navigate('Details', { item })}
            >
              <Image source={{ uri: item.imagerUrl }} style={styles.image} />
              <Text style={styles.address}>
                {addresses[item.id] || 'Fetching address...'}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignContent: 'center',
  },

  heading: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    margin: 10,
  },
  description: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
  },

  address: {
    fontSize: 18,
    padding: 10,
    color: 'blue',
    textAlign: 'center',
  },

  image: {
    width: '100%',
    height: 200,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});

export default HomeScreen;
