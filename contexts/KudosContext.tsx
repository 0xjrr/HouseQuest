import React, { createContext, useContext, useReducer } from 'react';
import { KudosOrSlobs } from '../models';

export enum KudosOrSlobsActionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

type KudosOrSlobsAction =
  | { type: KudosOrSlobsActionType.ADD; kudosOrSlobs: KudosOrSlobs }
  | { type: KudosOrSlobsActionType.REMOVE; id: string };

interface KudosOrSlobsState {
  kudosOrSlobs: ReadonlyArray<KudosOrSlobs>;
}

interface KudosOrSlobsContextProps {
  state: KudosOrSlobsState;
  dispatch: React.Dispatch<KudosOrSlobsAction>;
}

const initialState: KudosOrSlobsState = { kudosOrSlobs: [] };

const KudosOrSlobsContext = createContext<KudosOrSlobsContextProps>({
  state: initialState,
  dispatch: () => {}
});

function reducer(state: KudosOrSlobsState, action: KudosOrSlobsAction) {
  const { kudosOrSlobs } = state;
  switch (action.type) {
    case KudosOrSlobsActionType.ADD: {
      const others = kudosOrSlobs.filter((k) => k.id != action.kudosOrSlobs.id);
      return { ...state, kudosOrSlobs: [...others, action.kudosOrSlobs] };
    }
    case KudosOrSlobsActionType.REMOVE: {
      return {
        ...state,
        kudosOrSlobs: kudosOrSlobs.filter((k) => k.id != action.id)
      };
    }
    default: {
      // console.warn("Invalid kudos or slobs context action: ", action);
      return state;
    }
  }
}

export function KudosOrSlobsProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <KudosOrSlobsContext.Provider value={{ state, dispatch }}>
      {children}
    </KudosOrSlobsContext.Provider>
  );
}

export function useKudosOrSlobsContext() {
  return useContext(KudosOrSlobsContext);
}
