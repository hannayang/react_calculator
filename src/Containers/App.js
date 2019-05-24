import React, { Component } from 'react';
import './App.css';

const isOperator = /[+-/*]/; 
// text cases: 3 * 0.6 = ; 0.1 + 0.2 = 
const floatDecimalSolution = (num) => {
  return (Math.round(1000000000000 * num)) / 1000000000000
}; 
const result = (formularStr) => {
  return eval(formularStr)
}; 

class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      inputs: [], 
      incompleteInput: '',
      warning: '', 
    }
    this.resetHandler = this.resetHandler.bind(this); 
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

  numberHandler(event) {
    //test case: 999999999999999999 => If number string has 15 or more digits, then display a warning message, with a timeout of 1s.
    if(this.state.incompleteInput.length >= 15){
      this.setState({
        warning: 'DIGIT LIMIT MET', 
      }); 
      setTimeout(() => this.setState({warning: ''}), 1000);
    //test case: 3+000 => If number string has less than 15 digits: inputs: ['3', '+'] => if you already pressed a '0' for incompleteInput, then it can't be followed with another '0'. It can actually only be followed by a '.'.
    } else if(this.state.incompleteInput.length < 15 && this.state.inputs.indexOf('=') === -1) {
      this.setState({
        incompleteInput: this.state.incompleteInput === '0' ? '0' : this.state.incompleteInput + (event.target.value + ''),
      })
    //test case: 3+4=1 => inputs: ['3', '+', '4', '=' '7'] => A new calculation will be started and the inputs will become empty again. 
    } else if(this.state.inputs.indexOf('=') !== -1){
      this.setState({
        inputs: [], 
        incompleteInput: event.target.value, 
      })
    }
  }

  operatorHandler(event) {
    //test case: / => inputs: [], incompleteInput: ''; => If nothing has been pressed, then a new start should never be an operator. 
    if(this.state.incompleteInput === '' && this.state.inputs.length === 0) {
    } 
    //test case: ./ => No matter what is in the inputs array, an incomplete input like './' (a dot followed by an ooperator) should never be allowed. 
    else if(this.state.incompleteInput === '.'){
    } 
    //if inputs: ['3'] or ['3', '+', '4'] (i.e. no '='), 
    else if(this.state.inputs.indexOf('=') === -1) {
    //test case: 3/+ => further if inputs: ['3', '/'] (i.e. ends with an operator) and incompleteInput is empty, then when a new operator is pressed, the new operator should override the previous operator. 
      if(this.state.incompleteInput === '' && isOperator.test(this.state.inputs[this.state.inputs.length - 1]) === true){
        this.setState({
          inputs: this.state.inputs.slice(0, this.state.inputs.length - 1).concat([event.target.value]), 
          incompleteInput: '', 
        })
    //test case: 3+4/ => if inputs doesn't include '=', and further, inputs doesn't end with an operator, e.g.: ['3', '+', '4'], then when a new operator is pressed, it should be pushed into the inputs and become part of the calculator, e.g.: ['3', '+', '4', '/']  
      } else {
        this.setState({
          inputs: this.state.inputs.concat([this.state.incompleteInput, event.target.value]), 
          incompleteInput: '', 
        })
      }
    //test case: 3+4=/ => if inputs has '=' in it, e.g. inputs: ['3', '+', '4', '=', '7'], then when an operator is pressed, only the end value (i.e. '7') will be maintained in inputs for the next round of calculation. 
    } else {
      this.setState({
        inputs: [this.state.inputs[this.state.inputs.length - 1], event.target.value], 
        incompleteInput: '', 
      })
    }
  }

  decimalHandler(event) {
    //test case: 3+4... => if there is no '=' in inputs, e.g. inputs: ['3', '+'] and there is no '.' in incompleteInput, e.g.‘4’，then when '.' is pressed, it should be concatted to the end; otherwise if there is already a '.' in the incompleteInput, the newly pressed '.' should be ignored.  
    if(this.state.inputs.indexOf('=') === -1) {
      this.setState({
        incompleteInput: this.state.incompleteInput.indexOf('.') === -1 ? this.state.incompleteInput + (event.target.value + '') : this.state.incompleteInput,
      })
    //test case: 3+4=. => if there is '=' in inputs, e.g. inputs: ['3', '+', '4', '=', '7'], then when a '.' is pressed, it means a new calculation is started. '.' equals to '0.' in Javascript. 
    } else {
    this.setState({
      inputs: [], 
      incompleteInput: event.target.value,
      })
    }
  }

  evalHandler(event) {
    //test case: .=  => .= is not allowed (the same way as how ./ is not allowed.)
    if(this.state.inputs.length === 0 && this.state.incompleteInput === '.'){
    }
    //test case: 3+5/2==   => if pressing '=' for more than 1 time, all '=' will be ignored except the first. 
    else if(this.state.inputs.indexOf('=') !== -1){
    }
    //test case: 3= => if inputs array is empty, inputs: [], and if incompleteInput is not empty, e.g. incompleteInput: '3', then when '=' is pressed, inputs should become, e.g. ['3' '=' '3']. 
    else if(this.state.inputs.length === 0 && this.state.incompleteInput !== '') {
      this.setState({
        inputs: [this.state.incompleteInput, event.target.value, ' ', floatDecimalSolution(result(this.state.incompleteInput))], 
        incompleteInput: floatDecimalSolution(result(this.state.incompleteInput)), 
      })
    //if inputs: ['3', '+', '4', '-'], 
    } else if(this.state.inputs.length >= 2 && isOperator.test(this.state.inputs[this.state.inputs.length - 1]) === true) {
      //test case: 3+4-=  => further if incompleteInput is empty, i.e. '=' is pressed directly, then the '=' should override the '-' and the result will calculated. 
      if(this.state.incompleteInput === '') {
        this.setState({
          inputs: [this.state.inputs.slice(0, this.state.inputs.length - 1).join(''), event.target.value, ' ', floatDecimalSolution(result(this.state.inputs.slice(0, this.state.inputs.length -1).join('')))], 
          incompleteInput: floatDecimalSolution(result(this.state.inputs.slice(0, this.state.inputs.length -1).join(''))), 
        })
      //test case: 3+4-5=  => further if incompleteInput is not empty, e.g. incompleteInput: '5', then when '=' is pressed, '5' should be concated to the inputs array: ['3', '+', '4', '-', '5'] and then result is calculated.  
      } else {
        this.setState({
          inputs: [this.state.inputs.join(''), this.state.incompleteInput, event.target.value, ' ', floatDecimalSolution(result(this.state.inputs.concat(this.state.incompleteInput).join('')))], 
          incompleteInput: floatDecimalSolution(result(this.state.inputs.concat(this.state.incompleteInput).join(''))), 
        })
      }
    }
  }

  getExtendedState(state) { 
    return {
      formularDisplay: state.inputs.join(''),
      inputDisplay: state.warning === '' ? state. incompleteInput : state.warning, 
    };
  }

  render () {
    const extendedState = this.getExtendedState(this.state);
    return (
      <div className='wrap'>
        <div className="calculator">
          <div id='formular'>
            <p className='formularDisplay'>{extendedState.formularDisplay}</p>
          </div>
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
