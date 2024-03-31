import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface RecordingState {
  isRecording: boolean;
  stream: MediaStream | null;
}

// Define the initial state using that type
const initialState: RecordingState = {
  isRecording: false,
  stream: null,
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
    setStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.stream = action.payload;
    },
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { setRecording, setStream } = recordingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRecording = (state: RootState) => state.recording;

export default recordingSlice.reducer;
