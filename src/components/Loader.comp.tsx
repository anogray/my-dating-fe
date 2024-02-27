import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

const LoaderAnimation = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', "alignItems": 'center' }}>
      <LottieView
        source={require('../../assets/loaderAnimation.json')}
        style={{width: "50%", height: "50%"}}
        autoPlay
        // loop
      />
    </View>
  )
};

export default LoaderAnimation;
