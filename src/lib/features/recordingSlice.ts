import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface RecordingState {
  isRecording: boolean;
}

// Define the initial state using that type
const initialState: RecordingState = {
  isRecording: false,
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
  },
});

export const { setRecording } = recordingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRecording = (state: RootState) => state.recording;

export default recordingSlice.reducer;
