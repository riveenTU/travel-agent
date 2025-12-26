function Comments(props){
    return(
        <div>
            <div id="carouselExampleIndicators" class="carousel slide carousel-dark">
                <div class="carousel-indicators">
                    
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">

                    {props.comments.map((item,index)=>{
                        console.log(item);
                        return (index===1 ?  ( 
                            <div class="carousel-item active">
                                <p>{item.comment}</p>
                                <img src={`${item.image}`} class="carousel-img" alt="..."></img>
                                <em>{item.name}</em>
                            </div>)
                        
                            :   (<div class="carousel-item">
                                    <p>{item.comment}</p>
                                    <img src={`${item.image}`} class="carousel-img" alt="..."></img>
                                    <em>{item.name}</em>
                                </div>))
                    })}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Comments;