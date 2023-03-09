import React from 'react';
import { Link } from 'react-router-dom';

const Button = (props) => {
    return (
        props.to ?
            <Link  to={{ pathname: props.to, state: { reversalLogisticItem: null }, }}>{props.text}</Link>
            : props.image ?
                <div >
                    <p>{props.text}</p>
                </div>
                :
                <button
                    onClick={() => props.onClick()}
                    disabled={props.disabled ? true : false}
                    style={props.width ? { width: props.width } : null}
                    className={`button${props.color ? ` ${props.color}` : " blue"}${props.login ? " login" : ''}`}
                >
                    {props.confirmIcon &&
                        <span className='confirm-icon'></span>
                    }
                    {props.addIcon &&
                        <span className='add-icon'></span>
                    }
                    {props.text}
                </button>
    )
}

export default React.memo(Button);