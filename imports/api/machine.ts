import { createMachine } from 'xstate';

export const enum States {
    Lobby = 'Lobby',
    Preparation = 'Preparation',
    Fight = 'Fight',
    End = 'End',
}

export const enum Events {
    StartGame = 'StartGame',
    EndGame = 'EndGame',
    StartFight = 'StartFight',
    EndFight = 'EndFight',
    ReturnToLobby = 'ReturnToLobby',
}

export const gameMachine = createMachine({
    initial: States.Lobby,
    states: {
        [States.Lobby]: {
            on: {
                [Events.StartGame]: States.Preparation
            },
        },
        [States.Preparation]: {
            on: {
                [Events.StartFight]: States.Fight
            },
        },
        [States.Fight]: {
            on: {
                [Events.EndFight]: States.Preparation,
                [Events.EndGame]: States.End
            },
        },
        [States.End]: {
            on: {
                [Events.ReturnToLobby]: States.Lobby
            },
        },
    },
});