import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  location: {};
  errorMsg:  null;
}

const LocationContext = createContext<LocationContextType>({
  location: {},
  errorMsg: null,
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }:any) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let locationPermission = await Location.requestForegroundPermissionsAsync();
      console.log({locationPermission})
      if (locationPermission.status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationObj = await Location.getCurrentPositionAsync({});
      setLocation(locationObj);
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, errorMsg }}>
      {children}
    </LocationContext.Provider>
  );
};
