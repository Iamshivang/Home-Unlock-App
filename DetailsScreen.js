import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [isNearby, setIsNearby] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);


  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        
        const fineLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'This app needs access to your location to verify proximity.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Fine location permission denied');
          return;
        }

        if (Platform.Version >= 29) {
          const backgroundLocationGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Permission',
              message: 'This app needs background location access to work properly.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (backgroundLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Background location permission denied');
            return;
          }
        }
      }

      console.log('Location permissions granted');
      getUserLocation();
    } catch (err) {
      console.error('Permission Error:', err);
    }
  };


  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User Location:', latitude, longitude);
        setUserLocation({ latitude, longitude });

        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          parseFloat(item.latitude),
          parseFloat(item.longitude)
        );

        console.log('Distance to Home:', distance);
        setIsNearby(distance <= 30);
      },
      (error) => {
        console.error('Location Error:', error);
        alert(getLocationErrorMessage(error.code));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };


  const getLocationErrorMessage = (code) => {
    switch (code) {
      case 1:
        return 'Permission denied. Enable location services.';
      case 2:
        return 'Location unavailable. Try again.';
      case 3:
        return 'Location request timed out.';
      default:
        return 'Unknown location error.';
    }
  };


  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const createdAtDate = new Date(item.createdAt).toLocaleDateString();
  const createdAtTime = new Date(item.createdAt).toLocaleTimeString();

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imagerUrl }} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.dateTime}>📅 Date: {createdAtDate}</Text>
      <Text style={styles.dateTime}>⏰ Time: {createdAtTime}</Text>

      {isNearby ? (
        <Pressable onPress={() => console.log('Home Unlocked!')}>
          <View style={styles.pressableBtn}>
            <Text style={styles.textView}>Unlock Home</Text>
          </View>
        </Pressable>
      ) : (
        <Text style={styles.errorText}>❌ You are too far to unlock the home</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  dateTime: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
    color: 'gray',
  },
  pressableBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'lightgreen',
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowColor: 'red',
    margin: 10,
  },
  textView: {
    fontSize: 22,
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DetailsScreen;
