import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export class Grid extends React.Component {

  constructor(){
    super();
    this.items = [
      {index: 0, value: 0},
      {index: 1, value: 0},
      {index: 2, value: 0},
      {index: 3, value: 0},
      {index: 4, value: 0},
      {index: 5, value: 0},
      {index: 6, value: 0},
      {index: 7, value: 0},
      {index: 8, value: 0},
      {index: 9, value: 0},
      {index: 10, value: 0},
      {index: 11, value: 0},
      {index: 12, value: 0},
      {index: 13, value: 0},
      {index: 14, value: 0},
      {index: 15, value: 0},
      {index: 16, value: -1}
    ];
    this.state = {
      status: "I'm ready",
      moveCount: 0,
      score: 0
    };
    this.len = 4;
    this.tlen = this.len * this.len;
    this.free = this.tlen;
    this.randomAdd();
  }

  losingCondition(){
    var flag = true;
    if(this.free != 0) return false;
    for(var cnt = 0; cnt < this.tlen; cnt++){
      let v = this.items[cnt].value;
      if(v == this.items[this.posResolve(cnt, "right", "single")].value
      || v == this.items[this.posResolve(cnt, "down", "single")].value){
        flag = false;
      }
    }
    return flag;
  }

  randomAdd(){
    let limit = Math.max(1, Math.min(Math.round(this.free / 5), 3));
    let freeA = [];
    var len = 0;
    for(var cnt = 0; cnt < this.tlen; cnt++){
      if(this.items[cnt].value == 0){
        len = freeA.push(cnt);
      }
    }
    this.setState({log: 'Create ' + limit});
    if(len === 0) return -1;
    for(var cnt = 0; cnt < limit; cnt++){
      let pos = Math.floor(Math.random() * (len - 1));
      this.items[freeA[pos]].value = 2 * (Math.round(Math.random() / 5 * 3) + 1);
      freeA.splice(pos, 1);
      len -= 1;
    }
    this.free = Math.max(this.free - limit, 0);
    if(this.losingCondition()){
      this.setState({victory: 'Defeated'});
    }
    return 1;
  }

  colorResolve(value){
    let rv = this.len * this.len;
    while(value > 0){
      rv -= 1;
      value = value >> 1;
    }
    return rv;
  }

  posResolve(index, direction, type = "brute"){
    let x = index % this.len;
    let y = Math.floor(index / this.len);
    var i = 1;
    switch(direction){
      case "up":
        if(y <= 0) return this.tlen;
        else {
          if(type == "brute"){
            while(true){
              let r = (y - i) * this.len + x;
              if(r >= 0){
                if(this.items[r].value != 0) return r;
              } else break;
              i = i + 1;
            }
            return this.tlen;
          } else return (y - i) * this.len + x;
        }
        break;
      case "down":
        if(y >= this.len - 1) return this.tlen;
        else {
          if(type == "brute"){
            while(true){
              let r = (y + i) * this.len + x;
              if(r <= 15){
                if(this.items[r].value != 0) return r;
              } else break;
              i = i + 1;
            }
            return this.tlen;
          } else return (y + i) * this.len + x;
        }
        break;
      case "left": if(x <= 0) return this.tlen;
        else {
          if(type == "brute"){
            while(true){
              let r = y * this.len + x - i;
              if(x - i >= 0){
                if(this.items[r].value != 0) return r;
              } else break;
              i = i + 1;
            }
            return this.tlen;
          } else return y * this.len + x - i;
        }
        break;
      case "right": if(x >= this.len - 1) return this.tlen;
        else {
          if(type == "brute"){
            while(true){
              let r = y * this.len + x + i;
              if(x + i <= 3){
                if(this.items[r].value != 0) return r;
              } else break;
              i = i + 1;
            }
            return this.tlen;
          } else return y * this.len + x + i;
        }
        break;
      default: return this.tlen;
    }
  }

  addScore(amount){
    this.setState({score: this.state.score + amount});
  }

  posCollide(current, target){
    return this.cellCollide(this.items[current], this.items[target]);
  }

  cellCollide(current, target){
    if(target.value !== -1){
      if(current.value === target.value){
        current.value += target.value;
        this.addScore(current.value);
        this.free = Math.max(this.free + 1, 0);
      } else if(current.value === 0){
        current.value = target.value;
      } else return 0;
      target.value = 0;
      return 1;
    } else return 0;
  }

  onSwipeUp(gestureState) {
    this.setState({status: 'You swiped up!'});
    var legit = 0;
    for(var i = 0; i < this.len; i++){
      for(var j = 0; j < this.len; j++){
        let cnt = i * this.len + j;
        let current = this.items[cnt];
        if(current.value === 0){
          let target = this.items[this.posResolve(cnt, "down")];
          legit += this.cellCollide(current, target);
        }
        let target2 = this.items[this.posResolve(cnt, "down")];
        legit += this.cellCollide(current, target2);
      }
    }
    if(legit != 0){
      this.setState({moveCount: this.state.moveCount + 1});
      this.randomAdd();
    }
  }

  onSwipeDown(gestureState) {
    this.setState({status: 'You swiped down!'});
    var legit = 0;
    for(var i = 0; i < this.len; i++){
      for(var j = 0; j < this.len; j++){
        let cnt = (this.len - 1 - i) * this.len + (this.len - 1 - j);
        let current = this.items[cnt];
        if(current.value === 0){
          let target = this.items[this.posResolve(cnt, "up")];
          legit += this.cellCollide(current, target);
        }
        let target2 = this.items[this.posResolve(cnt, "up")];
        legit += this.cellCollide(current, target2);
      }
    }
    if(legit != 0){
      this.setState({moveCount: this.state.moveCount + 1});
      this.randomAdd();
    }
  }

  onSwipeLeft(gestureState) {
    this.setState({status: 'You swiped left!'});
    var legit = 0;
    for(var i = 0; i < this.len; i++){
      for(var j = 0; j < this.len; j++){
        let cnt = i + j * this.len;
        let current = this.items[cnt];
        if(current.value === 0){
          let target = this.items[this.posResolve(cnt, "right")];
          legit += this.cellCollide(current, target);
        }
        let target2 = this.items[this.posResolve(cnt, "right")];
        legit += this.cellCollide(current, target2);
      }  
    }
    if(legit != 0){
      this.setState({moveCount: this.state.moveCount + 1});
      this.randomAdd();
    }
  }

  onSwipeRight(gestureState) {
    this.setState({status: 'You swiped right!'});
    var legit = 0;
    for(var i = 0; i < this.len; i++){
      for(var j = 0; j < this.len; j++){
        let cnt = (this.len - 1 - i) + (this.len - 1 - j) * this.len;
        let current = this.items[cnt];
        if(current.value === 0){
          let target = this.items[this.posResolve(cnt, "left")];
          legit += this.cellCollide(current, target);
        }
        let target2 = this.items[this.posResolve(cnt, "left")];
        legit += this.cellCollide(current, target2);
      }  
    }
    if(legit != 0){
      this.setState({moveCount: this.state.moveCount + 1});
      this.randomAdd();
    }
  }

  onSwipe(gestureName, gestureState) {
    this.props.getScore(this.state.score);
  }

  render(){
    let sizeCell = Math.floor(parseInt(this.props.size) / this.len)
    let sizeReal = sizeCell * this.len;

    const dim = {
      grid: {
        backgroundColor: 'rgb(100, 200, 100)',
        width: sizeReal,
        height: 50 + sizeReal,
        position: 'absolute',
        top: this.props.locationX,
        left: this.props.locationY
      },
      cell: {
        width: sizeCell - 2,
        height: sizeCell - 2,
        position: 'absolute'
      }
    };

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={dim.grid}>
        <View>
          <Text>{this.state.moveCount} | {this.state.status} | {this.state.log} | {this.state.victory}</Text>
          {this.items.map((item, key) => {
              let x = item.index % this.len;
              let y = Math.floor(item.index / this.len);
              let extra = {
                pos: {
                  left: sizeCell * x + 1,
                  top: 50 + sizeCell * y + 1
                },
                color: {
                  backgroundColor: 'rgb(0, ' + (255 - this.colorResolve(item.value) * 14) + ', 0)',
                },
                font: {
                  color: this.colorResolve(item.value) < 8 ? '#000' : '#fff',
                  fontSize: (18 + this.colorResolve(item.value) * 1)
                },
                blank: {
                  backgroundColor: 'rgb(255, 255, 255)',
                }
              };
              if(item.value !== 0) return <View key={item.index} style={[dim.cell, extra.pos, extra.color]}>
              <Text style={extra.font}>{item.value}</Text>
              </View>;
              else return <View key={item.index} style={[dim.cell, extra.pos, extra.blank]}></View>;
            }
          )}
        </View>
      </GestureRecognizer>
    )
  }
}


Grid.propTypes = {
  getScore: PropTypes.func
};

              // <Text>{x} + {y} + {item.value}</Text>
              // <Text>{this.posResolve(item.index, "up")} + {this.posResolve(item.index, "down")}</Text>
              // <Text>{this.posResolve(item.index, "left")} + {this.posResolve(item.index, "right")}</Text>