import React from "react";
import './MostPopular.css';

function MostPopular(props){
    let image=props.image;
    
    return(
        <a href={props.link}>
           <div className="card">
                <img src={require(`${image}`)} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h1>{props.heading}</h1>
                    <p className="card-text">{props.content}</p>
                </div>
            </div>
        </a>
        
        
    );
}
export default MostPopular;
