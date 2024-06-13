import React, { Component } from "react";

//Const
const GLSYMBOL_DEF = "-";
const GLSYMBOL_X = "X";
const GLSYMBOL_O = "O";

//Operation
class clInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tictacBoard: {
        panels: Array(9).fill(GLSYMBOL_DEF),
        turn: GLSYMBOL_X,
        turnCnt: 0,
        resetButton: true,
      },
      scoreBoard: {
        winner: GLSYMBOL_DEF,
        xScore: 0,
        oScore: 0,
      },
    };

    this.newState = {};

    this.handleClick = [
      this.updatePanelVal.bind(this, 0),
      this.updatePanelVal.bind(this, 1),
      this.updatePanelVal.bind(this, 2),
      this.updatePanelVal.bind(this, 3),
      this.updatePanelVal.bind(this, 4),
      this.updatePanelVal.bind(this, 5),
      this.updatePanelVal.bind(this, 6),
      this.updatePanelVal.bind(this, 7),
      this.updatePanelVal.bind(this, 8),
      this.updatePanelVal.bind(this, 9),
    ];

    this.handleClickResetGame = this.resetGame.bind(this);

    this.vSymbol = [GLSYMBOL_X, GLSYMBOL_O];
    this.vPattern = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  resetGame() {
    return new Promise((resolve, reject) => {
      let vStateNew = JSON.parse(JSON.stringify(this.state));

      vStateNew.tictacBoard.panels = Array(9).fill(GLSYMBOL_DEF);
      vStateNew.tictacBoard.turn = GLSYMBOL_X;
      vStateNew.tictacBoard.turnCnt = 0;
      vStateNew.tictacBoard.resetButton = true;

      vStateNew.scoreBoard.winner = GLSYMBOL_DEF;

      this.setState(
        {
          tictacBoard: vStateNew.tictacBoard,
          scoreBoard: vStateNew.scoreBoard,
        },
        () => {
          console.log(this.state);
        }
      );

      resolve();
    });
  }

  placeMove(aPanelNum) {
    return new Promise((resolve, reject) => {
      let vTurn = this.state.tictacBoard.turn;
      switch (vTurn) {
        case GLSYMBOL_X:
          this.newState.tictacBoard.panels[aPanelNum] = GLSYMBOL_X;
          break;
        case GLSYMBOL_O:
          this.newState.tictacBoard.panels[aPanelNum] = GLSYMBOL_O;
          break;
        default:
          break;
      }
      resolve(0);
    });
  }

  checkWinner() {
    return new Promise((resolve, reject) => {
      let vPanels = this.newState.tictacBoard.panels;
      let vTurn = this.newState.tictacBoard.turn;

      for (let vEachPattern of this.vPattern) {
        let vTargetPanelVal = [
          vPanels[vEachPattern[0]],
          vPanels[vEachPattern[1]],
          vPanels[vEachPattern[2]],
        ];

        let vCheckResult = vTargetPanelVal.every((val) => val === vTurn);

        if (vCheckResult === true) {
          //Declare Winner
          this.newState.scoreBoard.winner = vTurn;

          //Increment Score
          if (vTurn === GLSYMBOL_X) {
            this.newState.scoreBoard.xScore =
              this.newState.scoreBoard.xScore + 1;
          } else {
            this.newState.scoreBoard.oScore =
              this.newState.scoreBoard.oScore + 1;
          }

          break;
        } else {
          //No Winner
          this.newState.scoreBoard.winner = GLSYMBOL_DEF;
        }
      }
      resolve(0);
    });
  }

  changeTurn() {
    return new Promise((resolve, reject) => {
      let vTurn = this.newState.tictacBoard.turn;
      switch (vTurn) {
        case GLSYMBOL_X:
          this.newState.tictacBoard.turn = GLSYMBOL_O;
          break;
        case GLSYMBOL_O:
          this.newState.tictacBoard.turn = GLSYMBOL_X;
          break;
        default:
          this.newState.tictacBoard.turn = GLSYMBOL_DEF;
          break;
      }

      this.newState.tictacBoard.turnCnt = this.newState.tictacBoard.turnCnt + 1;
      resolve(0);
    });
  }

  playerMove(aPanelNum) {
    return new Promise(async (resolve, reject) => {
      //Get current values
      this.newState = JSON.parse(JSON.stringify(this.state));
      let vPanel = this.state.tictacBoard.panels;

      if (vPanel[aPanelNum] === GLSYMBOL_DEF) {
        await this.placeMove(aPanelNum); //Place Move
        await this.checkWinner(); //Check Winner
        let vWinner = this.newState.scoreBoard.winner;

        if (vWinner === GLSYMBOL_DEF) {
          await this.changeTurn();
          let vTurnCnt = this.newState.tictacBoard.turnCnt;
          if (vTurnCnt < 9) {
            
          } else {
            this.newState.tictacBoard.resetButton = false
            alert("Draw Match!");
          }

        } else {
          this.newState.tictacBoard.resetButton = false
          alert("Won Match!");
        }

      } else {
        alert("Already accupied!");
      }

      resolve(0);
    });
  }

  async updatePanelVal(aPanelNum) {
    await this.playerMove(aPanelNum);

    this.setState(
      {
        tictacBoard: this.newState.tictacBoard,
        scoreBoard: this.newState.scoreBoard,
      },
      () => {
        console.log(this.state);
      }
    );
  }

  render() {
    return (
      <div id="tictactoe">
        <table id="tbl-tictac">
          <thead>
            <tr>
              <th colSpan={3}>TIC TAC TOE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td onClick={this.handleClick[0]}>
                {this.state.tictacBoard.panels[0]}
              </td>
              <td onClick={this.handleClick[1]}>
                {this.state.tictacBoard.panels[1]}
              </td>
              <td onClick={this.handleClick[2]}>
                {this.state.tictacBoard.panels[2]}
              </td>
            </tr>
            <tr>
              <td onClick={this.handleClick[3]}>
                {this.state.tictacBoard.panels[3]}
              </td>
              <td onClick={this.handleClick[4]}>
                {this.state.tictacBoard.panels[4]}
              </td>
              <td onClick={this.handleClick[5]}>
                {this.state.tictacBoard.panels[5]}
              </td>
            </tr>
            <tr>
              <td onClick={this.handleClick[6]}>
                {this.state.tictacBoard.panels[6]}
              </td>
              <td onClick={this.handleClick[7]}>
                {this.state.tictacBoard.panels[7]}
              </td>
              <td onClick={this.handleClick[8]}>
                {this.state.tictacBoard.panels[8]}
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td colSpan={3}>
                <input
                  type="button"
                  value={"Reset"}
                  onClick={this.handleClickResetGame}
                  disabled={this.state.tictacBoard.resetButton}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>

        <table id="tbl-scoreboard">
          <thead>
            <tr>
              <th colSpan={2}>Score Board</th>
            </tr>
            <tr>
              <td colSpan={2}>Winner : {this.state.scoreBoard.winner}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>X's</td>
              <td>{this.state.scoreBoard.xScore}</td>
            </tr>
            <tr>
              <td>O's</td>
              <td>{this.state.scoreBoard.oScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default clInterface;
//END
