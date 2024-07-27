import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/styles';

const MapsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderText}>No Image Available</Text>
      </View>
    </ScrollView>
  );
};

export default MapsScreen;
