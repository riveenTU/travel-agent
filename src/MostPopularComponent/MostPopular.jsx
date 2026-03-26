import React from "react";
import './MostPopular.css';

function MostPopular(props){
    let image=props.image;
    
    return(
        
           <div className="card">
                <img src={props.image} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h2 className="card-title">{props.heading}</h2>
                    <p className="card-text">{props.content}</p>
                    <a href={props.link} target="_blank" rel="noopener noreferrer">
                        <button className="btn">Book Now</button>
                    </a>
                </div>
            </div>
    );
}
export default MostPopular;
