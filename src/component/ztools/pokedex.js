import React, { Component } from "react";

export default class clPokeDex extends Component {
  constructor() {
    super();
    this.handlerGetUrlData = this.getUrlData.bind(this);
    this.state = {
      data:{
        name:"-",
        height:0.0,
        weight:0.0,
        sprites:{
          front_default:""
        }
      },
      searchValue :"pikachu"
    }
  }

  getUrlData() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${this.state.searchValue}`)
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        console.log(jsonData)
        console.log(jsonData.sprites.front_default)
        this.setState({
          data: jsonData
        })
      });
  }

  handleInputSearch = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  }


  render() {
    return (
      <div id="zt-pd">
        <div id="zt-pd-mod">
          <div id="zt-pd-header">
            <h1>POKEDEX</h1>
            <div>
              <input type="text" onChange={this.handleInputSearch}></input>
              <input
                type="button"
                value={"Search"}
                onClick={this.handlerGetUrlData}
              ></input>
            </div>
          </div>

          <div id="zt-pd-main">
            <div id="zt-pd-left-panel">
              <div>
                <img src={this.state.data.sprites.front_default}></img>
              </div>
            </div>

            <div id="zt-pd-right-panel">
              <div>
                <p>Name:</p>
                <p>{this.state.data.name.toUpperCase()}</p>
              </div>
              <div>
                <p>Characteristic:</p>
                <p>Height: {Number(this.state.data.height)/10}m</p>
                <p>Weight: {Number(this.state.data.weight)/10}kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
