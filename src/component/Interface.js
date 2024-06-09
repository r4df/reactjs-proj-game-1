import React, { Component } from "react";

//Const
const GLSYMBOL_DEF = "-";
const GLSYMBOL_X = "X";
const GLSYMBOL_O = "O";

class clInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tictacBoard: {
        panels: Array(9).fill(GLSYMBOL_DEF),
        turn: GLSYMBOL_X,
        turnCnt: 0,
      },
      scoreBoard: {
        winner: "-",
        xScore: 0,
        oScore: 0,
      },
    };

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

  placeMove(aPanelNum) {
    return new Promise(async (resolve, reject) => {
      //Get current values
      let vPanel = this.state.tictacBoard.panels;
      let vTurn = this.state.tictacBoard.turn;
      let vTurnCnt = this.state.tictacBoard.turnCnt;
      let vWinner = this.state.scoreBoard.winner;
      let vStateNew = JSON.parse(JSON.stringify(this.state));

      //Display Value
      if (vTurnCnt < 9 && vWinner === GLSYMBOL_DEF) {
        if (vPanel[aPanelNum] === GLSYMBOL_DEF) {
          switch (vTurn) {
            case GLSYMBOL_X:
              vStateNew.tictacBoard.panels[aPanelNum] = GLSYMBOL_X;
              break;
            case GLSYMBOL_O:
              vStateNew.tictacBoard.panels[aPanelNum] = GLSYMBOL_O;
              break;
            default:
              break;
          }

          vStateNew.scoreBoard = await this.checkWinner(vStateNew);
          vStateNew.tictacBoard = await this.changeTurn(vStateNew);
          resolve(vStateNew);
        } else {
          alert("Already accupied!");
          resolve(vStateNew);
        }
      } else {
        alert("Draw!");
        resolve(vStateNew);
      }
    });
  }

  checkWinner(aStateNew) {
    return new Promise((resolve, reject) => {
      let vStateNew = JSON.parse(JSON.stringify(aStateNew));
      let vPanels = vStateNew.tictacBoard.panels;
      let vTurn = vStateNew.tictacBoard.turn;

      for (let vEachPattern of this.vPattern) {
        let vTargetPanelVal = [
          vPanels[vEachPattern[0]],
          vPanels[vEachPattern[1]],
          vPanels[vEachPattern[2]],
        ];

        let vCheckResult = vTargetPanelVal.every((val) => val === vTurn);

        if (vCheckResult === true) {
          vStateNew.scoreBoard.winner = vTurn;
          break;
        } else {
          vStateNew.scoreBoard.winner = GLSYMBOL_DEF;
        }
      }
      resolve(vStateNew.scoreBoard);
    });
  }

  changeTurn(aStateNew) {
    return new Promise((resolve, reject) => {
      let vTurn = aStateNew.tictacBoard.turn;
      switch (vTurn) {
        case GLSYMBOL_X:
          aStateNew.tictacBoard.turn = GLSYMBOL_O;
          break;
        case GLSYMBOL_O:
          aStateNew.tictacBoard.turn = GLSYMBOL_X;
          break;
        default:
          aStateNew.tictacBoard.turn = GLSYMBOL_DEF;
          break;
      }

      aStateNew.tictacBoard.turnCnt = aStateNew.tictacBoard.turnCnt + 1;
      resolve(aStateNew.tictacBoard);
    });
  }

  async updatePanelVal(aPanelNum) {
    let vStateNew = await this.placeMove(aPanelNum);

    this.setState(
      {
        tictacBoard: vStateNew.tictacBoard,
        scoreBoard: vStateNew.scoreBoard,
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
              <th colSpan={3}>TIC TAC</th>
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
