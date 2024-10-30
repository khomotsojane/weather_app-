import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = 'API_KEY';

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  const getLocationAndFetchWeather = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetchWeatherByCoords(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('City not found', error);
      alert('City not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city) fetchWeatherByCity(city);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Cosmic Weather ✨</Text>

      {/* Text Input for City Name */}
      <TextInput
        style={styles.input}
        placeholder="Search a city"
        placeholderTextColor="#c9c9c9"
        value={city}
        onChangeText={setCity}
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Show Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />}

      {/* Display Weather Data */}
      {weather && !loading && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>

          {/* Weather Icon and Description */}
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
              style={styles.icon}
            />
            <Text style={styles.description}>{weather.weather[0].description}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c3d',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#f4c2c2',
    fontWeight: '700',
    marginVertical: 20,
    textShadowColor: '#3b3b5e',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#6464ff',
    backgroundColor: '#272750',
    color: '#fefefe',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#6464ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#2e2e5e',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  city: {
    fontSize: 24,
    color: '#fff7e6',
    fontWeight: '600',
    textShadowColor: '#f4c2c2',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  temp: {
    fontSize: 48,
    color: '#fefefe',
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: '#aaaaff',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  description: {
    fontSize: 20,
    color: '#ccccff',
    textTransform: 'capitalize',
  },
});
