import React, { Component } from "react";

const GLPOKEAPIURL = "https://pokeapi.co/api/v2/pokemon/";

export default class clPokeDex extends Component {
  constructor() {
    super();
    this.handlerGetUrlData = this.getUrlData.bind(this);
    this.state = {
      data: {
        name: "-",
        height: 0.0,
        weight: 0.0,
        sprites: {
          front_default: "",
        },
        types: [],
        id:"-",
      },
      searchValue: "pikachu",
    };
  }

  getUrlData() {
    fetch(GLPOKEAPIURL + `${this.state.searchValue}`)
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        console.log(jsonData);
        console.log(jsonData.sprites.front_default);
        this.setState({
          data: jsonData,
        });
      });
  }

  handleInputSearch = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

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
              <div>
                <p>No.: {this.state.data.id}</p>
                <p>Types:</p>
                <div>
                  {this.state.data.types.map((item, index) => (
                    <a href={item.type.url} className={`zt-pd-type zt-pd-type-${item.type.name}`}>
                      {item.type.name}
                    </a>
                  ))}
                </div>

              </div>
            </div>

            <div id="zt-pd-right-panel">
              <div>
                <p>Name:</p>
                <p>{this.state.data.name.toUpperCase()}</p>
              </div>
              <div>
                <p>Ht: {Number(this.state.data.height) / 10}m</p>
                <p>Wt: {Number(this.state.data.weight) / 10}kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
