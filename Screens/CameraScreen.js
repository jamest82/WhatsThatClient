/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function sendToServer(data) {
    console.log('HERE', data.uri);

    const id = await AsyncStorage.getItem('whatsthat_user_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');

    const result = await fetch(data.uri);
    const blob = await result.blob();

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/photo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'X-Authorization': token
        },
        body: blob
      }
    ).then((response) => {
      if (response.status === 200) {
        console.log('photo added');
      } else if (response.status === 400) {
        console.log('bad request');
      } else if (response.status === 401) {
        console.log('Unauthorised');
      } else if (response.status === 403) {
        console.log('Forbidden');
      } else if (response.status === 404) {
        console.log('Not Found');
      } else {
        console.log('server error');
      }
    });
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);

      console.log(data.uri);
    }
  }

  return (
    <View>
      <Camera type={type} ref={(ref) => setCamera(ref)}>
        <View style={{
          height: 700,
          width: 300
        }}
        >
          <TouchableOpacity onPress={toggleCameraType}>
            <Text>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={takePhoto}>
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

