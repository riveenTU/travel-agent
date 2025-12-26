import React from "react";
import MostPopular from "../MostPopularComponent/MostPopular";
import "./ToursCollection.css"

function ToursCollection(props){
    return(
        <div>
            
            <div className="name">
                <h1 className="name-h1">Our Packages</h1>
                {props.mostPopularItems.map((item, index)=>(
                    <MostPopular 
                    key={index}
                    id={index}
                    image={item.image}
                    heading={item.heading}
                    content={item.content}
                    link={item.link}
                    />
                ))}
            </div>
            
        </div>
    )
}
export default ToursCollection;