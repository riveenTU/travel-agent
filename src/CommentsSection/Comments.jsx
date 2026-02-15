function Comments(props){
    return(
        <div>
            <div id="carouselExampleIndicators" className="carousel slide carousel-dark">
                <div className="carousel-indicators">
                    
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">

                    {props.comments.map((item,index)=>{
                        return (index===1 ?  ( 
                            <div key={index} className="carousel-item active">
                                <p>{item.comment}</p>
                                <img src={`${item.image}`} className="carousel-img" alt="..." />
                                <em>{item.name}</em>
                            </div>)
                        
                            :   (<div key={index} className="carousel-item">
                                    <p>{item.comment}</p>
                                    <img src={`${item.image}`} className="carousel-img" alt="..." />
                                    <em>{item.name}</em>
                                </div>))
                    })}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Comments;