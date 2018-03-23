import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Grid } from './grid';
import { Scoreboard } from './scoreboard';

export default class Game2048 extends React.Component {

  constructor(){
    super();
    this.state = {
      score: 0
    }
  }

  getScore(scr){
    this.setState({score: scr});
  }

  render(){
    var {height, width} = Dimensions.get('window');
    let x = 100;
    let y = 0;
    let xx = 0;
    let yy = 0;

    return (
      <View style={overallStyle.outerBox}>
        <Scoreboard locationX={xx} locationY={yy} score={this.state.score}></Scoreboard>
        <Text>{this.state.score}</Text>
        <Grid size={Math.min(height, width)} locationX={x} locationY={y} getScore={this.getScore.bind(this)}></Grid>
      </View>
    )
  }
}

const overallStyle = StyleSheet.create({
  outerBox: {
    paddingTop: 15,
    backgroundColor: 'rgb(200, 100, 100)',
    flex: 1,
    alignItems: 'center'
  }
});