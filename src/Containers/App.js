import React, { Component } from 'react';
import './App.css';

const isOperator = /[+-/*]/; 
const floatDecimalSolution = (num) => {
  return (Math.round(1000000000000 * num)) / 1000000000000
}; 

class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      inputs: [], 
      incompleteInput: '',
    }
    this.resetHandler = this.resetHandler.bind(this); 
    // this.maxDigitWarning = this.maxDigitWarning.bind(this); 
    this.numberHandler = this.numberHandler.bind(this); 
    this.operatorHandler = this.operatorHandler.bind(this); 
    this.decimalHandler = this.decimalHandler.bind(this); 
    this.evalHandler = this.evalHandler.bind(this); 
  }

  resetHandler() {
    this.setState({
      inputs: [],
      incompleteInput: '',
    })
  }

  // maxDigitWarning() {
  //   this.setState({
  //     display: 'DIGIT LIMIT MET'
  //   }); 
  //   setTimeout(() => this.setState({display: this.state.incompleteInput}), 1000);
  // }

  numberHandler(event) {
    if(this.state.inputs.indexOf('=') === -1) {
      this.setState({
        incompleteInput: this.state.incompleteInput === '0' ? '0' : this.state.incompleteInput + (event.target.value + ''),
      })
    } else {
      this.setState({
        inputs: [], 
        incompleteInput: event.target.value, 
      })
    }
  }

  operatorHandler(event) {
    if(this.state.incompleteInput === '' && this.state.inputs.length === 0) {
    } else if(this.state.incompleteInput === '' && isOperator.test(this.state.inputs[this.state.inputs.length - 1]) === true) {
      this.setState({
        inputs: this.state.inputs.slice(0, this.state.inputs.length - 1).concat([event.target.value]), 
        incompleteInput: '', 
      })
    } else if(this.state.inputs.indexOf('=') === -1) {
      this.setState({
        inputs: this.state.inputs.concat([this.state.incompleteInput, event.target.value]), 
        incompleteInput: '', 
      })
    } else {
      this.setState({
        inputs: [this.state.inputs[this.state.inputs.length - 1], event.target.value], 
        incompleteInput: '', 
      })
    }
  }

  decimalHandler(event) {
    if(this.state.inputs.indexOf('=') === -1) {
      this.setState({
        incompleteInput: this.state.incompleteInput.indexOf('.') === -1 ? this.state.incompleteInput + (event.target.value + '') : this.state.incompleteInput,
    })
  } else {
    this.setState({
      inputs: [], 
      incompleteInput: event.target.value,
      })
    }
  }

  evalHandler(event) {
    if(this.state.inputs.length === 0) {
      if(this.state.incompleteInput !== '') {
        this.setState({
          inputs: [this.state.incompleteInput, event.target.value, floatDecimalSolution(eval(this.state.incompleteInput))], 
          incompleteInput: floatDecimalSolution(eval(this.state.incompleteInput)), 
        })
      }
    } else if(this.state.inputs.length === 1 && isOperator.test(this.state.inputs[0]) === true && this.state.incompleteInput === '') {
        this.setState({
          inputs: [], 
          incompleteInput: '',
        })
    } else if(this.state.inputs.length >= 2 && isOperator.test(this.state.inputs[this.state.inputs.length - 1]) === true && this.state.inputs.indexOf('=') === -1) {
      if(this.state.incompleteInput === '') {
        this.setState({
          inputs: [this.state.inputs.slice(0, this.state.inputs.length - 1).join(''), event.target.value, floatDecimalSolution(eval(this.state.inputs.slice(0, this.state.inputs.length -1).join('')))], 
          incompleteInput: floatDecimalSolution(eval(this.state.inputs.slice(0, this.state.inputs.length -1).join(''))), 
        })
      } else {
        this.setState({
          inputs: [this.state.inputs.join(''), this.state.incompleteInput, event.target.value, floatDecimalSolution(eval(this.state.inputs.concat(this.state.incompleteInput).join('')))], 
          incompleteInput: floatDecimalSolution(eval(this.state.inputs.concat(this.state.incompleteInput).join(''))), 
        })
      }
    } else if(this.state.inputs.indexOf('=') >= 0) {
      this.setState({
        inputs: this.state.inputs, 
        incompleteInput: this.state.incompleteInput,
      })
    }
  }

  getExtendedState(state) { 
    return {
      formularDisplay: state.inputs.join(''),
      inputDisplay: state.incompleteInput,
    };
  }

  render () {
    const extendedState = this.getExtendedState(this.state);
    return (
      <div className='wrap'>
        <div className="calculator">
          <div id='formula'>{extendedState.formularDisplay}</div>
          <div id='input'>{extendedState.inputDisplay}</div>
          <div className='buttons'>
            <div className='row'>
              <button id='clear'    className='big-buttons'       value='AC'  onClick={this.resetHandler}>A C</button>
              <button id='divide'   className='operator-buttons'  value='/'   onClick={this.operatorHandler}>/</button>
            </div>
            <div className='row'>
              <button id='seven'    className='number-buttons'    value='7'   onClick={this.numberHandler}>7</button>
              <button id='eight'    className='number-buttons'    value='8'   onClick={this.numberHandler}>8</button>
              <button id='nine'     className='number-buttons'    value='9'   onClick={this.numberHandler}>9</button>
              <button id='multiply' className='operator-buttons'  value='*'   onClick={this.operatorHandler}>x</button>
            </div>
            <div className='row'>
              <button id='four'     className='number-buttons'    value='4'   onClick={this.numberHandler}>4</button>
              <button id='five'     className='number-buttons'    value='5'   onClick={this.numberHandler}>5</button>
              <button id='six'      className='number-buttons'    value='6'   onClick={this.numberHandler}>6</button>
              <button id='minus'    className='operator-buttons'  value='-'   onClick={this.operatorHandler}>-</button>
            </div>
            <div className='row'>
              <button id='one'      className='number-buttons'    value='1'   onClick={this.numberHandler}>1</button>
              <button id='two'      className='number-buttons'    value='2'   onClick={this.numberHandler}>2</button>
              <button id='three'    className='number-buttons'    value='3'   onClick={this.numberHandler}>3</button>
              <button id='add'      className='operator-buttons'  value='+'   onClick={this.operatorHandler}>+</button>
            </div>
            <div className='row'>
              <button id='zero'     className='middle-buttons'    value='0'   onClick={this.numberHandler}>0</button>
              <button id='decimal'  className='number-buttons'    value='.'   onClick={this.decimalHandler}>.</button>
              <button id='equals'   className='equal-buttons'     value='='   onClick={this.evalHandler}>=</button>
            </div>
          </div>
        </div>
        <div className='footnote'>
          <p> Designed and coded by </p>
          <p> Hanna Yang </p>
        </div>
      </div>
    );
  }; 
}; 

export default App;
