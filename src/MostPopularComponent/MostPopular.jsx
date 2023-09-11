import React from "react";
import './MostPopular.css';

function MostPopular(props){
    let image=props.image;
    console.log(image);
    return(
        <a href={props.link}>
           <div class="card">
                <img src={require(`${image}`)} class="card-img-top" alt="..."></img>
                <div class="card-body">
                    <h1>{props.heading}</h1>
                    <p class="card-text">{props.content}</p>
                </div>
            </div> 
        </a>
        
        
    );
}
export default MostPopular;
