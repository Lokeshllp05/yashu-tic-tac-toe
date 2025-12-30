# Yashu Tic-Tac-Toe

A professional-level 2-player Tic-Tac-Toe web application with a modern glassmorphic design and MongoDB Atlas integration.

## 🚀 Features
- **Player Names**: Enter custom names for Player X and Player O.
- **Modern UI**: Smooth animations, glassmorphism effects, and responsive design.
- **Win/Draw Detection**: Accurate game logic with visual highlights on win conditions.
- **Database Integration**: Automatically saves game results (Player names and winner) to MongoDB Atlas.
- **Dual Reset Modes**:
  - **Restart Game**: Clears the board for a rematch but keeps player names.
  - **New Game**: Resets the entire app state, including names.

## 🛠️ Project Structure
- `index.html`: The structure of the application.
- `style.css`: Modern styling and animations.
- `script.js`: Core game logic and frontend API calls.
- `server.js`: Node.js/Express backend for database connectivity.
- `package.json`: Project dependencies and scripts.
- `.env`: Environment variables for MongoDB credentials (Keep this safe!).

## 🏁 How to Run
1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **Setup**:
   - Open the terminal in the project directory.
   - Run `npm install` to install dependencies.
3. **Configuration**:
   - Open `.env` and ensure your `MONGODB_URI` is correctly set up with your username and password.
4. **Start the Backend**:
   - Run `node server.js` to start the backend server on `http://localhost:5000`.
5. **Start the Game**:
   - Open `index.html` in your web browser.

## 📝 Next Session
To continue your work next session, simply:
1. Open the folder `yashu` in your editor.
2. Run `node server.js` in the terminal.
3. Open `index.html` in your browser.
