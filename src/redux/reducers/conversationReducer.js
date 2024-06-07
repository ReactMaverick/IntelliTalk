import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postData, postFormData } from '@/values/api/apiprovider';
import { LOGIN_URL, REGISTER_URL } from '@/values/api/url';
import { showToast } from '@/constants/constants';
import { CHAT_WITH_AI_URL } from '../../values/api/url';
import { OPENAI_API_KEY } from '../../common/common';

export const chatWithAI = createAsyncThunk('conversation/chatWithAI', async (data, { rejectWithValue }) => {
  try {

    const { messages, userMessage } = data;

    console.log('Messages in async thunk ==> ', messages);

    console.log('User Message in async thunk ==> ', userMessage);

    const response = await fetch(CHAT_WITH_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...messages,
          userMessage
        ],
        temperature: 0.7,
      })
    })

    console.log('Request Body in async thunk ==> ', JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        userMessage
      ],
      temperature: 0.7,
    })
    );

    console.log('response in async thunk ==> ', response);

    if (!response.ok) {
      return rejectWithValue('Failed to chat with AI');
    }

    const responseData = await response.json();

    console.log('Response data in async thunk ==> ', responseData);

    return responseData.choices[0].message.content;

  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant that can check grammar and provide training.'
    }
  ],
  conversations: [],
  error: null
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearConversations: state => {
      state.conversations = [];
      state.messages = [{
        role: 'system',
        content: 'You are a helpful assistant that can check grammar and provide training.'
      }];
    }
  },
  extraReducers: builder => {
    builder.addCase(chatWithAI.fulfilled, (state, action) => {
      // console.log('Action payload ==> ', action.payload);
      state.conversations.push({
        role: 'system',
        content: action.payload
      });

      state.messages.push({
        role: 'system',
        content: action.payload
      });
    });

    builder.addCase(chatWithAI.rejected, (state, action) => {
      state.error = action.payload;
    });
  }

});

export const selectConversation = state => state.conversationReducer.conversations;
export const selectMessages = state => state.conversationReducer.messages;

export const { addConversation, clearConversations, addMessage } = conversationSlice.actions;

export default conversationSlice.reducer;
