import React, { Component } from "react";

//Const
const GLSYMBOL_DEF = "-";
const GLSYMBOL_X = "X";
const GLSYMBOL_O = "O";

const GLPANELCOLOR_N = "#566573";
const GLPANELCOLOR_S = "#5DADE2"; //Selected
const GLPANELCOLOR_W = "#58D68D"; //Won

const GLMATCHSTS_END = 0;
const GLMATCHSTS_INPROGRESS = 1;

//Operation
class clInterface extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tictacBoard: {
        panels: Array(9).fill(GLSYMBOL_DEF),
        panelsBgColor: Array(9).fill(GLPANELCOLOR_N),
        panelsStyle: Array(9).fill(""),
        turn: GLSYMBOL_X,
        turnCnt: 0,
        resetButton: true,
        matchStatus: GLMATCHSTS_INPROGRESS,
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
      vStateNew.tictacBoard.panelsBgColor = Array(9).fill(GLPANELCOLOR_N);
      vStateNew.tictacBoard.panelsStyle = Array(9).fill("");
      vStateNew.tictacBoard.turn = GLSYMBOL_X;
      vStateNew.tictacBoard.turnCnt = 0;
      vStateNew.tictacBoard.resetButton = true;
      vStateNew.tictacBoard.matchStatus = GLMATCHSTS_INPROGRESS;

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

  #playerMove_placeMove(aPanelNum) {
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

      this.newState.tictacBoard.panelsBgColor[aPanelNum] = GLPANELCOLOR_S;
      resolve(0);
    });
  }

  #playerMove_checkWinner() {
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

          //
          for (let vInd = 0; vInd < 9; vInd++) {
            this.newState.tictacBoard.panelsBgColor[vInd] = GLPANELCOLOR_N;
          }
          //BG Color
          for (let vInd = 0; vInd < 3; vInd++) {
            this.newState.tictacBoard.panelsBgColor[vEachPattern[vInd]] =GLPANELCOLOR_W;
            this.newState.tictacBoard.panelsStyle[vEachPattern[vInd]] = "panelBlink";
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

  #playerMove_changeTurn() {
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

      if (this.newState.tictacBoard.matchStatus === GLMATCHSTS_INPROGRESS) {
        if (vPanel[aPanelNum] === GLSYMBOL_DEF) {
          await this.#playerMove_placeMove(aPanelNum); //Place Move
          await this.#playerMove_checkWinner(); //Check Winner
          let vWinner = this.newState.scoreBoard.winner;

          if (vWinner === GLSYMBOL_DEF) {
            await this.#playerMove_changeTurn();
            let vTurnCnt = this.newState.tictacBoard.turnCnt;
            if (vTurnCnt < 9) {
            } else {
              this.newState.tictacBoard.resetButton = false;
              this.newState.tictacBoard.matchStatus = GLMATCHSTS_END;
              alert("Draw Match!");
            }
          } else {
            this.newState.tictacBoard.resetButton = false;
            this.newState.tictacBoard.matchStatus = GLMATCHSTS_END;
            alert("Won Match!");
          }
        } else {
          alert("Already accupied!");
        }
      } else {
        alert("Match completed, click 'Reset' to proceed to next match.");
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
        <div id="tictactoe-mod-1">
          <table id="tbl-tictac">
            <thead>
              <tr>
                <th colSpan={3}>TIC TAC TOE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={this.state.tictacBoard.panelsStyle[0]}
                  onClick={this.handleClick[0]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[0],
                  }}
                >
                  {this.state.tictacBoard.panels[0]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[1]}
                  onClick={this.handleClick[1]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[1],
                  }}
                >
                  {this.state.tictacBoard.panels[1]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[2]}
                  onClick={this.handleClick[2]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[2],
                  }}
                >
                  {this.state.tictacBoard.panels[2]}
                </td>
              </tr>
              <tr>
                <td
                  className={this.state.tictacBoard.panelsStyle[3]}
                  onClick={this.handleClick[3]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[3],
                  }}
                >
                  {this.state.tictacBoard.panels[3]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[4]}
                  onClick={this.handleClick[4]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[4],
                  }}
                >
                  {this.state.tictacBoard.panels[4]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[5]}
                  onClick={this.handleClick[5]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[5],
                  }}
                >
                  {this.state.tictacBoard.panels[5]}
                </td>
              </tr>
              <tr>
                <td
                  className={this.state.tictacBoard.panelsStyle[6]}
                  onClick={this.handleClick[6]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[6],
                  }}
                >
                  {this.state.tictacBoard.panels[6]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[7]}
                  onClick={this.handleClick[7]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[7],
                  }}
                >
                  {this.state.tictacBoard.panels[7]}
                </td>
                <td
                  className={this.state.tictacBoard.panelsStyle[8]}
                  onClick={this.handleClick[8]}
                  style={{
                    backgroundColor: this.state.tictacBoard.panelsBgColor[8],
                  }}
                >
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
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>Winner : {this.state.scoreBoard.winner}</td>
              </tr>
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
      </div>
    );
  }
}

export default clInterface;
//END
