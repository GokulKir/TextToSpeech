import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { GiftedChat, Message } from "react-native-gifted-chat";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
export default function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("The output message");
  const [messages, setMessages] = useState([]);

  const handleButtonClick = () => {
    console.log(inputMessage.toLocaleLowerCase().startsWith("generate image")==true,"hhhhi");
    if(inputMessage.toLocaleLowerCase().startsWith("generate image")){
      // console.log("generate images");
      generateImages()
    }else{
      // console.log("generate text");

      generateText()
    }
   
  };
  const handleTextInputMessage = (text) => {
    console.log(text);
    setInputMessage(text);
  };

  const generateText = () => {
    console.log('text generated********************************');
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        // "prompt": inputMessage,
        messages: [{ role: "user", content: inputMessage }],
        // "model": "text-davinci-003",
        model: "gpt-3.5-turbo",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.choices[0].message.content.trim(), "data");
        setOutputMessage(data.choices[0].message.content.trim());
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 2, name: "Devlacus" },
        };

        setMessages((previousMessage) =>
          GiftedChat.append(previousMessage, [message])
        );
        options ={}
        Speech.speak(data.choices[0].message.content,options);
      });
      setInputMessage("");
  };
  const generateImages = () => {
    console.log('images,********************************');
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 2,
        size: "1024x1024",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data, "data");
        setOutputMessage(data.data[0].url);
        data.data.forEach((item) => {
          console.log();
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: "image",
            createdAt: new Date(),
            user: { _id: 2, name: "Devlacus" },
            image: item.url,
          };
          setMessages((previousMessage) =>
            GiftedChat.append(previousMessage, [message])
          );
        });
        setInputMessage("");
      });
  };
  // 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
  return (
    <ImageBackground source={require('./assets/bg.jpg')} resizeMode="cover" style={{flex:1,height:"100%",width:"100%"}}>
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* <Text>{outputMessage}</Text> */}
        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {}}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginRight: 2,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            height: 40,
            marginRight: 10,
            justifyContent: "center",
          }}
        >
          <TextInput
            placeholder=" 🔎 Enter The question"
            onChangeText={handleTextInputMessage}
            value={inputMessage}
          />
        </View>
        <TouchableOpacity onPress={handleButtonClick}>
          <View
            style={{
              backgroundColor: "#ff5615",
              padding: 5,
              borderRadius: 30,
              height: 40,
              width: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Text style={{ color: "#fff" }}>Sent</Text> */}
            <Ionicons name="send" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
