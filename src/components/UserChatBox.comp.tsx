import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import UserService from "../utils/user.service";
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "../context/UserContext.context";
import { SocketContext } from "../context/Socket.context";

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    //   padding: 15, // Add some padding around the chat content
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10, // Increase padding within message bubbles
    backgroundColor: "#E0E0E0", // Adjust background color
    borderRadius: 15, // Adjust border radius for a smoother curve
    width: "80%",
  },
  rightMessage: {
    marginBottom: 15,
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "lightgreen", // Adjust background color
    borderRadius: 15, // Adjust border radius
    width: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "gray", // Adjust timestamp color
    fontStyle: "italic",
    marginTop: 5, // Add some spacing above the timestamp
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#CCC", // Light border to separate input from messages
    padding: 10,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10, // Add padding for better readability
    backgroundColor: "#F2F2F2", // Light background for input field
    borderRadius: 5, // Rounded corners for input field
  },

  sendIcon: {
    width: 24, // Set the desired width
    height: 24, // Set the desired height
    // marginRight: 10, // Add margin for spacing from the button text (optional)
  },
  sendButtonContainer: {
    // backgroundColor: '#DDD', // Light background color for the button
    borderRadius: 5, // Rounded corners for a button-like look
    paddingHorizontal: 5, // Add horizontal padding for better spacing
    paddingVertical: 5, // Add vertical padding for better spacing
    alignItems: "center", // Center the icon horizontally
    justifyContent: "center", // Center the icon vertically
  },
});

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);

  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
};

const UserChatBox = ({ props }) => {
  const { id: receiverId } = props.route.params;
  const listRef = React.createRef<FlatList<any>>();

  const { token, setProfile, profile } = useContext(AuthContext);
  const [pageConfig, setPageConfig] = useState({ page: 1, limit: 10 });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { globalSocket } = useContext(SocketContext);


  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (globalSocket) {
      globalSocket.on("receive-msg", (data) => {
        const senderId = data?.message?.senderId;
        if (senderId && senderId == receiverId) {
          // Process the received message for the current chat
          console.log("Received message for chat with ID:", senderId,data);
          // You can update the chat messages state here
          if (data) {
            console.log("checkmessgaeindex",data.message,messages?.length)
            //@ts-ignore
            setMessages((prev)=>[...prev, data.message])
            // setNewMessage(""); // Clear input field
            if (listRef.current) {
              listRef.current.scrollToEnd({ animated: true });
            }
          }
        }
      });
    }

    // Clean up the event listener when the component unmounts
    // return () => {
    //   if (globalSocket) {
    //     // globalSocket.off("receive-msg");
    //   }
    // };
  }, [globalSocket, receiverId]);

  // useEffect(() => {
  //   console.log("listRef",messages.length);
  //   if (listRef.current) {
  //     listRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [messages.length]); // Re-scroll on message updates

  // useEffect(()=>{

  //   if(listRef.current&&messages.length){
  //     console.log("yesSScrolling",messages.length)
  //     listRef.current.scrollToEnd({ animated: true });

  //   }
  // },[listRef.current,messages.length])

  const fetchMessages = async () => {
    try {
      let messagesData = await UserService.userChatBox(
        token,
        receiverId,
        pageConfig.page,
        pageConfig.limit
      );
      messagesData = messagesData.reverse();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleScroll = () => {
    // const scrollY = listRef.current? ?? 0; // Get scroll position
    // fetchOlderMessages();

    // if (scrollY <= 10) { // Adjust threshold as needed
    //   // User is near the top, fetch older messages
    // }
  };

  const fetchOlderMessages = async () => {
    try {
      const newMessages = await UserService.userChatBox(token,receiverId,pageConfig.page + 1,pageConfig.limit
        );
        console.log("fetchOlderMessages",pageConfig)

      if (newMessages.length) {
        setPageConfig((prev)=>{return { ...prev, page: pageConfig.page + 1 }});
        setMessages([...newMessages.reverse(), ...messages]);
      }
    } catch (error) {
      console.error("Error fetching older messages:", error);
    }
  };
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return ""; // Handle empty message attempts
    }

    try {
      const newMessageData = await UserService.postMessage(
        token,
        String(receiverId),
        newMessage
      );

      // Update UI with the newly sent message:

      // Option 1: Directly update messages array (if service returns message data)
      if (newMessageData) {
        setMessages([...messages, newMessageData]);
        setNewMessage(""); // Clear input field
        if (listRef.current) {
          listRef.current.scrollToEnd({ animated: true });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const renderMessage = ({ item: message }) => {
  //   const isSender = profile.id == message.senderId; // Use state variable for logged-in user
  //   const messageStyle = isSender
  //     ? styles.rightMessage
  //     : styles.messageContainer;

  //   const formattedDate = getRelativeTime(message.createdDate); // Custom function for relative time

  //   return (
  //     <View style={messageStyle} key={message.id}>
  //       <Text style={styles.messageText}>{message.content}</Text>
  //       <Text style={styles.messageTimestamp}>{formattedDate}</Text>
  //     </View>
  //   );
  // };

  const ReenderMessage = React.memo(({ item: message }) => {
    const isSender = profile.id == message.senderId;
    const messageStyle = isSender ? styles.rightMessage : styles.messageContainer;
    const formattedDate = getRelativeTime(message.createdDate);
  
    return (
      <View style={messageStyle}>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTimestamp}>{formattedDate}</Text>
      </View>
    );
  });
  

  const renderSendButton = () => (
    <TouchableOpacity
      disabled={!newMessage.trim()} // Disable for empty messages
      onPress={sendMessage}
      style={styles.sendButtonContainer} // Apply custom styles (optional)
    >
      <Image
        source={require("../../assets/send.png")} // Replace with your asset path
        style={styles.sendIcon} // Define styles for the icon image
        tintColor={!newMessage.trim() ? "#CCC" : "#000"} // Adjust tint color for enabled/disabled states
      />
    </TouchableOpacity>
  );

return(
  <View style={styles.chatContainer}>
  <FlatList
  ref={listRef}
  data={messages}
  renderItem={({ item }) => <ReenderMessage item={item} />}
  keyExtractor={(item) => item.id.toString()}
  style={styles.chatContainer}
  onEndReachedThreshold={0.1}
  onEndReached={fetchOlderMessages}
  inverted
  contentContainerStyle={{ flexDirection: 'column-reverse' }}
  showsVerticalScrollIndicator={false}
/>
<View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        {renderSendButton()}
      </View>
</View>

)
  // return (
  //   <View style={styles.chatContainer}>
  //     <FlatList
  //       ref={listRef}
  //       data={messages}
  //       renderItem={renderMessage}
  //       keyExtractor={(item) => item.id}
  //       style={styles.chatContainer}
  //       onEndReachedThreshold={0.1}
  //       onEndReached={fetchOlderMessages}
  //       inverted contentContainerStyle={{ flexDirection: 'column-reverse' }}
  //       // onLayout={() => {
  //       //   listRef.current.scrollToEnd({ animated: false });
  //       // }}
  //     >
  //       {/* Render loading indicator while fetching messages */}
  //       {messages.length === 0 && (
  //         <Text style={styles.loadingText}>Loading messages...</Text>
  //       )}
  //     </FlatList>
  //     <View style={styles.messageInputContainer}>
  //       <TextInput
  //         style={styles.messageInput}
  //         placeholder="Message"
  //         value={newMessage}
  //         onChangeText={setNewMessage}
  //       />
  //       {renderSendButton()}
  //       {/* <Button title="Send" onPress={sendMessage} disabled={!newMessage.trim()} /> */}
  //     </View>
  //   </View>
  // );
};

export default UserChatBox;
