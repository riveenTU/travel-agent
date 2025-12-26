import React from "react";
import MostPopular from "../MostPopularComponent/MostPopular";
import Comments from "../CommentsSection/Comments";
import NavigationBar from "../NavigationBarComponent/NavigationBar";

function Content(props){
    return(
        <div>
            <div>
                <NavigationBar/>
                {/* Home Section 1 */}
                <div class="home-section-1">
                <img src={require("./images/image8.jpg")} alt="..." />
                    {/* <p>EXPLORE <br/> SRI LANKA......</p> */}
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim. Suspendisse pretium pharetra neque non tincidunt. Mauris scelerisque dolor id felis volutpat scelerisque. Quisque ullamcorper condimentum leo, eget auctor justo hendrerit ut. Mauris tincidunt malesuada mauris quis convallis. Phasellus lacinia mauris sed auctor rutrum.</p>
                </div>
            </div>
            
                       
            {/* Home Section 2 */}
            <div class="home-section-2">
                <div>
                    <p>Destinations</p>
                </div>
                
                <img src={require("./images/image14.png")} alt="..." />
            </div>

            {/* Home Section 3 */}
            <div class="home-section-3">
                
                {/* <img class="home-section-3-img" src="./images/image 4.png" alt="" srcset=""></img> */}
                
                <h1 class="home-section-3-h1">Most Popular...</h1>
                
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

            {/* Home Section 4 */}
            <div class="home-section-4">
                <Comments comments={props.comments}/>
            </div>

            {/* Home Section 5 */}
            <div id="about" className="home-section-5">
                <img src="./images/image11.png" alt="..." srcset="" />
                <div className="home-section-5-content">
                    <h1>Why Us ?...</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim. Suspendisse pretium pharetra neque non tincidunt. Mauris scelerisque dolor id felis volutpat scelerisque. Quisque ullamcorper condimentum leo, eget auctor justo hendrerit ut. Mauris tincidunt malesuada mauris quis convallis. Phasellus lacinia mauris sed auctor rutrum.</p>
                </div>
            </div>

            {/* Home Section 6 */}
            <div id="contact" className="home-section-6">
                <h1>Contact Us</h1>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Name</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
                        {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Email</label>
                        <input type="password" class="form-control" id="exampleInputPassword1"></input>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Message</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default Content;
