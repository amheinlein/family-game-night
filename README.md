# family-game-night
Games intended to be played with others on a local bluetooth connection

React native using expo for multi platform
Expo router for navigation

will need to support: Touch, drag, long-press / hover as input

## Problems this solves
- Road trips
- Restauraunt
- Wasting paper at the kitchen table
- always available
- kids and family can play together

## Core vision
- NO INTERNET CONNECTION REQUIRED
- games will be modular with the same functionality
- games can be played either with 1 device (and multiple people) or multiple devices connected together
- games look and feel like they are drawn on paper. prefer lined/ruled paper. some will use graph paper or plain blank page


## App flow
Home screen with a menu (will decide all actions as we go) to start it will have Play and Settings

Play -> show a grid view of tiles with a game image and name

Select a game -> Game Menu
Game menu will have options:
Single Player
Multi-Plyer 1 device
Multi-Player multiple devices


Game interface 
Top left have an indicator of the player names and colors
    tap/click will allow player to select a color (Crayola 8 basic colors for now)
    These colors will be how its displayed on the local client. Meaning if there are mutliple ipads connected over bluetooth, they should individually be able to select what each player looks like on their own screen
    **Pain point insight** Kids like to pick their color and sometimes both want to be the same color. This would make it hard to differentiate the game/board states. Individually customizable local experience is a must.

Middle - Text label for the name of the game
Right - label or indicator for who is on the Current-turn, next turn, previous turn.
    Holding down the "previous turn" indicator highlight the move that the last player made

When a new game begins the screen should render the interface labels and show an animation of drawing the game onto paper
    Duration is set in code (e.g. a constants or game-config file), not by the user—so it’s easy to find and tweak while developing

## Games
- Tic Tac Toe
- Dot Game (maybe it is called boxes? A game where a players take turns drawing a line and score a point everytime they close a box)
- Connect 4 
    -- Neeed to think a bit on how this will go, maybe buttons on the top of each column to drop the piece down

## About single player
    Settings screen should allow a user to set a difficulty level. maybe from 1 -> 10 or easy, medium, hard
    Each game should be required to implement a strategy for the "computer opponents" at each difficulty

## About multi player single device
When a user selects multiplayer single device, all of the turn indicators as well as player indicators should function as notmal.
- This allows multiple people to play by passing the device back and forth, or sitting it on a table between them etc.
- this also allows one person to simulate moves and strategy etc

## About multi player multiple devices
- The number one goal is for kids sitting next to eachother with their own devices to play together
-- ideally this would allow any number of connections. If there is a huge hurdle technically that differentiates the ability to connect several devices, we can cap it at 2 devices. It would be nice long term to be able to include 4 - 8 player games but our initial MVP only has 2 player games so this would be sufficient- but i do want to explore the complexity here if we do decide to cap it at 2 devices
- There should be two options - Host | Join
-- Host would show an interface for them to configure game settings (if applicable) and view all connected users
-- When the host determines enough players joined and the settings are right, there is a START button
-- Join would search for games which are currently in a Host state and are accepting players


