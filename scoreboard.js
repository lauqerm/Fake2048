import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

export class Scoreboard extends React.Component {

	render(){
		const dim = {
			name: {
				fontSize: 40,
				fontWeight: 'bold'
			},
			container: {
				alignItems: 'center',
				width: 300,
				height: 60,
				backgroundColor: 'rgb(255, 255, 180)'
			}
		};
		return (
			<View style={dim.container}>
				<Text style={dim.name}>FAKE 2048</Text>
				<Text>{this.props.score}</Text>
			</View>
		)
	}
}