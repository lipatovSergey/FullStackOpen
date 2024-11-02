import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
import { setNotificationWithTimeout } from "./notificationReducer";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload;
      const updatedState = state.map((anecdote) =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      );
      return updatedState.sort((a, b) => b.votes - a.votes);
    },
    addAnecdote(state, action) {
      console.log(action.payload);
      state.push(action.payload);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes);
    },
  },
});

export const { updateAnecdote, addAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
    dispatch(
      setNotificationWithTimeout(`You created ${newAnecdote.content}`, 2000)
    );
  };
};

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState();
    const anecdoteToVote = state.anecdotes.find(
      (anecdote) => anecdote.id === id
    );
    const newVotes = anecdoteToVote.votes + 1;
    const updated = await anecdoteService.vote(id, newVotes);
    dispatch(updateAnecdote(updated));
    dispatch(
      setNotificationWithTimeout(`You voted for ${updated.content}`, 5000)
    );
  };
};

export default anecdoteSlice.reducer;
