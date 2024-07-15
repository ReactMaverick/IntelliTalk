import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postData, postFormData } from '@/values/api/apiprovider';
import { LOGIN_URL, REGISTER_URL } from '@/values/api/url';
import { showToast } from '@/constants/constants';
import { CHAT_WITH_AI_URL } from '../../values/api/url';

export const chatWithAI = createAsyncThunk('conversation/chatWithAI', async (data, { rejectWithValue }) => {
  try {

    const { messages, userMessage, assistant, openAIKey } = data;

    // console.log("Date == > ", data);

    // console.log('Messages in async thunk ==> ', messages);

    // console.log('User Message in async thunk ==> ', userMessage);

    const response = await fetch(CHAT_WITH_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
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

    // console.log('Request Body in async thunk ==> ', JSON.stringify({
    //   model: 'gpt-3.5-turbo',
    //   messages: [
    //     ...messages,
    //     userMessage
    //   ],
    //   temperature: 0.7,
    // })
    // );

    // console.log('response in async thunk ==> ', response);


    if (!response.ok) {
      return rejectWithValue('Failed to chat with AI');
    }

    const responseData = await response.json();

    // console.log('Response data in async thunk ==> ', responseData);

    return {
      response: responseData.choices[0].message.content,
      assistant
    };

  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  maleMessages: [{
    role: 'assistant',
    content: 'Hello, I am a helpful assistant named "John". I can check grammar and provide training.'
  }],
  femaleMessages: [{
    role: 'assistant',
    content: 'Hello, I am a helpful assistant named "Jenny". I can check grammar and provide training.'
  }],
  maleConversation: [],
  femaleConversation: [],
  assistant: null,
  error: null
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    addMaleConversation: (state, action) => {
      state.maleConversation.push(action.payload);
    },
    addFemaleConversation: (state, action) => {
      state.femaleConversation.push(action.payload);
    },
    addMaleMessage: (state, action) => {
      state.maleMessages.push(action.payload);
    },
    addFemaleMessage: (state, action) => {
      state.femaleMessages.push(action.payload);
    },
    setAssistant: (state, action) => {
      state.assistant = action.payload;
    },
    clearMaleConversations: state => {
      state.maleConversation = [];
      state.maleMessages = [{
        role: 'assistant',
        content: 'Hello, I am a helpful assistant named "John". I can check grammar and provide training.'
      }];
    },
    clearFemaleConversations: state => {
      state.femaleConversation = [];
      state.femaleMessages = [{
        role: 'assistant',
        content: 'Hello, I am a helpful assistant named "Jenny". I can check grammar and provide training.'
      }];
    }
  },
  extraReducers: builder => {
    builder.addCase(chatWithAI.fulfilled, (state, action) => {
      console.log('Action payload ==> ', action.payload);
      const { response, assistant } = action.payload;

      if (assistant === 'John') {
        state.maleConversation.push({
          role: 'assistant',
          content: response
        });

        state.maleMessages.push({
          role: 'assistant',
          content: response
        });
      } else {
        state.femaleConversation.push({
          role: 'assistant',
          content: response
        });

        state.femaleMessages.push({
          role: 'assistant',
          content: response
        });
      }
    });

    builder.addCase(chatWithAI.rejected, (state, action) => {
      state.error = action.payload;
    });
  }

});

export const selectConversation = (state, assistant) => {
  return assistant === 'John' ? state.conversationReducer.maleConversation : state.conversationReducer.femaleConversation;
};

export const selectMessages = (state, assistant) => {
  return assistant === 'John' ? state.conversationReducer.maleMessages : state.conversationReducer.femaleMessages;
};

export const selectAssistant = state => state.conversationReducer.assistant;

export const { setAssistant, addMaleConversation, addMaleMessage, addFemaleConversation, addFemaleMessage, clearMaleConversations, clearFemaleConversations } = conversationSlice.actions;

export default conversationSlice.reducer;
