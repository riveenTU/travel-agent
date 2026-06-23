import React, { useState, useEffect} from "react";
import MostPopular from "../MostPopularComponent/MostPopular";
import Comments from "../CommentsSection/Comments";
import NavigationBar from "../NavigationBarComponent/NavigationBar";
import "./Content.css";

function Content(props){

    const [popularTours, setPopularTours] = useState([]);

    useEffect(() => {
        async function fetchPopularTours() {
            try {
                const res = await fetch('http://localhost:4000/api/tours/popular');
                const data = await res.json();
                setPopularTours(data);
            } catch (error) {
                console.error("Error fetching popular tours:", error);
            }
        }
        fetchPopularTours();
    }, []);

    return(
        <div>

            <NavigationBar/>
            
            {/* Home Section 1 */}
            <div className="home-section-1">
                <img src="/images/image.png" alt="..." />
                {/* <p>EXPLORE <br/> SRI LANKA......</p> */}
                <div className="home-section-1-text">
                    <h1>Discover the Wonder of Sri Lanka</h1>
                    <p>An island of ancient heritage, vibrant culture, and untouched nature awaits.</p>
                </div>
                
            </div>
            
                       
            {/* Home Section 2 */}
            <div className="home-section-2">
                <p className="home-section-2-heading">Explore Our Regions</p>
                <div className="home-section-2-cards">
                <div className="home-section-2-card card">
                    <img src="/images/sigiriya_rock.jpg" className="card-img-top" alt="" srcset="" />
                    <div className="card-body">
                        <h1 className="home-section-2-card-heading">The Cultural Triangle</h1>
                        <p className="home-section-2-card-content">Discover ancient cities, magnificent temples, and rich history.</p>
                        <a href="#">View More</a>
                    </div>
                </div>
                <div className="home-section-2-card card">
                    <img src="/images/beach2.jpg" className="card-img-top" alt="" srcset="" />
                    <div className="card-body">
                        <h1 className="home-section-2-card-heading">Coastal & Beaches</h1>
                        <p className="home-section-2-card-content">Relax on golden sands and turquoise waters.</p>
                        <a href="#">View More</a>
                    </div>
                </div>
                <div className="home-section-2-card card">
                    <img src="/images/train.jpg" className="card-img-top" alt="" srcset="" />
                    <div className="card-body">
                        <h1 className="home-section-2-card-heading">Hill Country</h1>
                        <p className="home-section-2-card-content">Experience the lush greenery and cool climate of the highlands.</p>
                        <a href="#">View More</a>
                    </div>
                </div>
                <div className="home-section-2-card card">
                    <img src="/images/tea.jpg" className="card-img-top" alt="" srcset="" />
                    <div className="card-body">
                        <h1 className="home-section-2-card-heading">Wildlife & Nature</h1>
                        <p className="home-section-2-card-content">Explore the diverse flora and fauna of Sri Lanka's tropical forests.</p>
                        <a href="#">View More</a>
                    </div>
                </div>
                </div>
                
                {/* <img src={require("./images/image14.png")} alt="..." /> */}
            </div>

            {/* Home Section 3 */}
            <div className="home-section-3">
                
                {/* <img class="home-section-3-img" src="./images/image 4.png" alt="" srcset=""></img> */}
                
                <h1 className="home-section-3-h1">Most Popular...</h1>
                
                {popularTours.map((item, index)=>(
                    <MostPopular 
                    key={item._id}
                    id={index}
                    image={item.coverImage}
                    heading={item.name}
                    content={item.duration}
                    link={`/tour/${item._id}`}
                    />
                ))}
            
            </div>

            {/* Home Section 4 */}
            <div className="home-section-4">
                <Comments comments={props.comments}/>
            </div>

            {/* Home Section 5 */}
            <div id="about" className="home-section-5">
                <img src="./images/sigiriya.jpg" alt="..." srcset="" />
                <div className="home-section-5-content">
                    <h1>Why Us ?...</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim. Suspendisse pretium pharetra neque non tincidunt. Mauris scelerisque dolor id felis volutpat scelerisque. Quisque ullamcorper condimentum leo, eget auctor justo hendrerit ut. Mauris tincidunt malesuada mauris quis convallis. Phasellus lacinia mauris sed auctor rutrum.</p>
                </div>
            </div>

            {/* Home Section 6 */}
                <div id="contact" className="home-section-6">
                <h1>Contact Us</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Email</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Message</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default Content;
