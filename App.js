import React, { useState, useEffect } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

// pb with Android connecting to local adb websocket 8080 >>> pass expo to LAN

let ws = null;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  // GET AN ID
  const [username, setUsername] = useState("");

  const handleUser = () => {
    setUser({
      _id: String(Math.random()),
      name: username,
    });
  };

  console.log(user);

  // console.log("new messages ==> ", messages);

  // connect to websocket server, included into giftedChat
  useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");

    // return () => {
    //   ws.close();
    //   ws = null;
    // };
  }, []);

  useEffect(() => {
    const handleReceive = (event) => {
      const message = JSON.parse(event.data);
      setMessages([message, ...messages]);
    };
    if (ws) ws.addEventListener("message", handleReceive);
    return () => {
      if (ws) ws.removeEventListener("message", handleReceive);
    };
  }, [messages]);

  return (
    <>
      {!user ? (
        <View style={styles.container}>
          <Text>username</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
          <Button title="SUBMIT" onPress={handleUser} />
        </View>
      ) : (
        <>
          <GiftedChat
            messages={messages}
            onSend={(messagesToSend) => {
              const message = messagesToSend[0];
              ws.send(JSON.stringify(message));
              setMessages([message, ...messages]);
            }}
            user={user}
          />
          <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === "android"}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 44,
    paddingHorizontal: 20,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginVertical: 50,
  },
});
