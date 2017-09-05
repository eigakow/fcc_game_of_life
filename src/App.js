import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var FontAwesome = require('react-fontawesome');

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="title">Game of Life</div>
        <Board />
      </div>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    var arr = this.createRandomArray(50, 30);
    this.state = {
      boardArray: arr,
      width: 50,
      height: 30,
      generation: 1,
      timer: null,
      speed: 1000.0,
      started: false
    }
  }
  componentDidMount() {
    this.startGame();
  }
  createEmptyArray = (width,height) => {
    var arr = [];
    for (var i=0; i<height; i++){
      arr[i] = [];
      for (var j=0; j<width; j++) {
        arr[i].push(0);
      }
    }
    return arr
  }

  createRandomArray = (width,height) => {
    var arr = [];
    for (var i=0; i<height; i++){
      arr[i] = [];
      for (var j=0; j<width; j++) {
          if (Math.random() < 0.3) {arr[i].push(2)}
          else {arr[i].push(0)}
      }
    }
    return arr
  }
  createNextGenBoard = (width,height) => {
    var arr = [];
    for (var i=0; i<height; i++){
      arr[i] = [];
      for (var j=0; j<width; j++) {
          arr[i].push(this.checkFieldNextGen(j,i))
      }
    }
    return arr
  }

  checkFieldNextGen = (x,y) => {
    /*Returns 0, 1 or 2*/
    //var x = keyStr.split(",")[0];
    //var y = keyStr.split(",")[1];
    // Neighbours will be [x-1y-1]  [x-1 y]  [x-1 y+1]
    //                    [x y-1]            [x y+1]
    //                    [x+1 y-1] [x+1 y]  [x+1 y+1]

    // calculate neighbours
    const neighbours = [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],
                        [x+1,y-1],[x+1,y],[x+1,y+1]];
    const boardState = this.state.boardArray;
  //  console.log(boardState)
    var sum=0;
    neighbours.forEach((n) => {
  //    console.log(n)
  //    console.log(boardState[n[0]][n[1]]);
      if (n[0]>= 0 && n[0]<this.state.width && n[1]>= 0 && n[1]<this.state.height){
        if (boardState[n[1]][n[0]] > 0) {sum++}
      }
    });
  //  console.log("Total neighbours: ", sum, " for cell ", x,":",y)
    //Infant born?
    if (sum === 3 && boardState[y][x] === 0) {return 1}
    //Dead?
    if (sum < 2 || sum > 3) {return 0}
    //Maturing
    if ((sum === 2 || sum === 3) && boardState[y][x] > 0) {return 2}
  }
  stepGeneration = () => {
    this.setState({
			boardArray: this.createNextGenBoard(this.state.width, this.state.height),
      generation: this.state.generation + 1
		});
  }
  clearBoard = () => {
    this.setState({
      boardArray: this.createEmptyArray(this.state.width, this.state.height),
      generation: 1
    });
  }
  randomBoard = () => {
    this.setState({
      boardArray: this.createRandomArray(this.state.width, this.state.height),
      generation: 1
    });
  }
  changeField = (key) => {
    var x = key.split(",")[1];
    var y = key.split(",")[0];
//    console.log(x,y);
    var arr = this.state.boardArray
    if (arr[y][x] !== 2) {arr[y][x] = 2}
    else {arr[y][x] = 0}
    this.setState ({
      boardArray: arr
    })
  }
  startGame = () => {
    if (!this.state.started) {
      let timer = setInterval(this.stepGeneration, this.state.speed);
      this.setState({
        timer,
        started: true
      });
    console.log("Game started.Speed: ", this.state.speed)
    }
  }
  stopGame = () => {
    if (this.state.started) {
      clearInterval(this.state.timer);
      this.setState({
        started: false
      });
      console.log("Game stopped. Speed: ", this.state.speed)
    }
  }
  updateTimer = () => {
    if (this.state.started) {
      clearInterval(this.state.timer);
      this.setState({
        started: false
      }, function(){
        let timer = setInterval(this.stepGeneration, this.state.speed);
        this.setState({
          timer,
          started: true
        }, function(){
          console.log("Game reloaded with the new speed: ", this.state.speed)
        }
      );
      });
  }}

  decreaseSpeed = () => {
    this.setState({
      speed: this.state.speed + 200
    });
    console.log("Speed: ", this.state.speed);
    if (this.state.started) { this.updateTimer() }
  }
  increaseSpeed = () => {
    if (this.state.speed > 200) {
      this.setState({
        speed: this.state.speed - 200
      });
    }
    console.log("Speed: ", this.state.speed);
    if (this.state.started) { this.updateTimer() }
  }
  increaseSize= () => {
    if (this.state.width === 50){
      this.changeSize(70,50)
    }
    else if (this.state.width === 70) {
      this.changeSize(100,80)
    }
  }
  decreaseSize = () => {
    if (this.state.width === 100){
      this.changeSize(70,50)
    }
    else if (this.state.width === 70) {
      this.changeSize(50,30)
    }
  }
  changeSize= (w,h) => {
    this.setState({
      width: w,
      height: h,
      boardArray: this.createRandomArray(w,h),
      generation: 1
    }, function(){
      console.log("Game reloaded with the new size: ", this.state.width)
    });
  }

  render(){
    const fields = this.state.boardArray.map(function(row,idrow){
        return row.map(function(field, idcolumn){
          var key = idrow.toString() + "," + idcolumn.toString();
//          console.log(field)
          if (field === 2) {
            return <div className="Cell alive" key={key} onClick={() => this.changeField(key)}></div>
          }
          else if (field === 1) {
            return <div className="Cell infant" key={key} onClick={() => this.changeField(key)}></div>
          }
          else {
            return <div className="Cell dead" key={key} onClick={() => this.changeField(key)}></div>
          }
        }, this)
      },this)
//      console.log(fields)
//    const renderIng = this.props.ing.map(function(x, idx){
//      return <div className="ingredient" key={idx}>{x}</div>
//    })
//      for (var i=0; i<100; i++) {
//        return (<div className="Cell"></div>)
//      }
//    };
    return (
      <div>
        <div className={"Board " + (this.state.width === 50 ? "small" : this.state.width === 70 ? "medium" : "large")}>
          <div className="boardTitle">
            <FontAwesome className="random icons" size='2x' name="refresh" onClick={this.randomBoard} />
            <FontAwesome className="play icons" size='2x' name="play-circle" onClick={this.startGame} />
            <FontAwesome className="pause icons" size='2x' name="pause-circle" onClick={this.stopGame} />
            <FontAwesome className="clear icons" size='2x' name="times-circle" onClick={this.clearBoard} />
            <div className="generationCount text">Generation: {this.state.generation}</div>
          </div>
          <div className="fields">
            {fields}
          </div>
          <div className="bottom">
            <div className="speedAdj text">{"Speed:  "}
              <FontAwesome className="plus" name="arrow-circle-down" onClick={this.decreaseSpeed} />
              <div className="plus text">{this.state.speed/1000} s</div>
              <FontAwesome className="plus" name="arrow-circle-up" onClick={this.increaseSpeed} />
            </div>
            <div className="sizeAdj text">{"Board Size:  "}
              <FontAwesome className=" plus" name="arrow-circle-down" onClick={this.decreaseSize} />
              <div className="plus text">{this.state.width} x {this.state.height}</div>
              <FontAwesome className="plus" name="arrow-circle-up" onClick={this.increaseSize} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
