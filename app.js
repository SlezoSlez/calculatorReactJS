import React, {useReducer} from 'react'
import './style.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS= {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'

}

function reducer(state, { type, payload } ){
    switch(type){
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite){
                return{
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                  }}
            if (payload.digit ==="0"&& state.currentOperand ==="0") return state /*Nepovoli viac nul za sebou*/
            if (payload.digit ==="." && state.currentOperand.includes(".")) return state /*Nepovoli viac bodiek za sebou a zaroven ak uz v cisle bodka je*/

            return{
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`,/*zapisuje cisla po zvoleni*/
            }
        
        
        case ACTIONS.CHOOSE_OPERATION:/*výber operacii s cislami*/
            if (state.currentOperand == null && state.previousOperand == null){
                return state
            }
            
            if (state.currentOperand == null){/*zmena operacie za pocas pocitania*/
                return{
                    ...state,
                    operation: payload.operation,
                }
            }

            if(state.previousOperand == null ){
            return{
                ...state,
                operation: payload.operation,
                previousOperand: state.currentOperand,
                currentOperand: null,
            }
            
            }
            return{
                ...state,
                previousOperand: evaluate(state),/*pri zvoleni dalsej operacie vypocita vysledok a pracuje dalej*/
                operation:payload.operation,
                currentOperand:null

            }


            case ACTIONS.CLEAR:
            return{}/*vymaze vsetko*/

            case ACTIONS.EVALUATE:
                if(state.operation == null|| state.currentOperand == null || state.previousOperand == null){
                    return state
                }
                return{
                    ...state,
                    previousOperand : null,
                    overwrite:true,
                    operation : null,
                    currentOperand : evaluate(state)
             
                }

                case ACTIONS.DELETE_DIGIT:
                    if (state.overwrite){
                        return{
                            ...state,
                            overwrite : false,
                            currentOperand : null,

                        }
                    }
                    if (state.currentOperand == null) return state
                    if (state.currentOperand.lenght === 1){
                        return {
                            ...state,
                            currentOperand: null,
                        }
                    }
                    return{
                        ...state,
                        currentOperand: state.currentOperand.slice(0,-1)/*vymaze posledne cislo*/
                    }
    }
}

function evaluate({currentOperand,previousOperand,operation}){
    const prev = parseFloat(previousOperand)/*premeni hodnoty na cisla*/
    const curr = parseFloat(currentOperand)
    if (isNaN(prev)|| isNaN(curr))return"" /*ak nemaju zapisanu hodnotu tak vysledok null*/ 
    let computation = ""/*zakladna hodnota */

    switch(operation){
        case "+":
            computation = prev + curr
            break
        case "-":
            computation = prev-curr
            break
        case "*":
            computation = prev*curr
            break
        case "%":
            computation = prev/curr
    }

    return computation.toString() /*premena cisla na string*/


}



function App(){

    const [{currentOperand, previousOperand, operation},dispatch] = useReducer(reducer,{})

    return (
        <div className='calculator-grid'>
            <div className="output">
                <div className="previous-operand">{previousOperand}{operation}</div>
                <div className="current-operand">{currentOperand}</div>

            </div>
            <button className="dvojtlac" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
            <OperationButton operation="%" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className='dvojite' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
        </div>
    )

}

export default App