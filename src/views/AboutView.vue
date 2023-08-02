<template>
  <div class="about">
    <input v-model="messageContent" placeholder="매세지 입력">
    <button @click="sendMessage">Send</button>
    <div v-for="message in messages" :key="message">
      {{ message.message }}
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onBeforeUnmount, reactive} from 'vue'
import SockJs from 'sockjs-client/dist/sockjs.min.js'
import Stomp from "webstomp-client"


export default {
  name: "ChatComponent",
  setup() {
    const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
    const state = reactive({
      stomp: {
        socket: undefined,
        client: undefined
      },
    });

    const messageContent = ref("");
    const messages = ref([]);

    onMounted(() => {
      console.log("API_BASE_URL", API_BASE_URL);
      connect();
    })

    onBeforeUnmount(() => {
      if (state.stomp.client.connected) {
        state.stomp.client.disconnect();
      }
    });

    const connect = () => {
      const socket = new SockJs(`${API_BASE_URL}/chat`);
      state.stomp.client = Stomp.over(socket);
      state.stomp.client.connect({header: "foo"}, onConnect, onError );
    };
    const onConnect = () => {
      state.stomp.client.subscribe("/topic/message", (message) => {
        console.log("message is : ", message)
        messages.value.push(JSON.parse(message.body));
      });
    };
    const onError = (error) => {
        console.warn("stomp client connect error");
        console.debug("stomp error msg", error);
    };



    const sendMessage = () => {
      const messageObject = { id: 'testId',  message: messageContent.value };
      if (state.stomp.client.connected) {
        state.stomp.client.send("/app/send", JSON.stringify(messageObject));
        messageContent.value = "";
      }
    };

    return {
      messageContent,
      messages,
      sendMessage,
    };
  },
  methods: {

  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
