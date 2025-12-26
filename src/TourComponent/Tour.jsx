import React, { useState } from "react";
// import "./Tour.css";
import "./Tour1.css";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import isBetween from 'dayjs/plugin/isBetween';
import NavigationBar from "../NavigationBarComponent/NavigationBar";

// useEffect(()=>{
//     function initialization(){
//         setCurrentActivity(
//             listOfActivities.filter((item, index)=>{
//                 return index==0;
//             })
//         )
//     }
//     initialization();
// },[])

function Tour(props){
    let image1 = props.tourDetails.image1
    let listOfActivities = props.tourDetails.activities;
    
    //Date Navigation
    const [currentActivity, setCurrentActivity] = useState([listOfActivities[0]]);
    
    function changeContent(date){
        setCurrentActivity(
             listOfActivities.filter((item, index)=>{
                console.log("date "+index);
                return date===index+1;
            })
        )
    }
    // console.log(currentActivity);
    let image2 = currentActivity[0].image2;



    //Book now button visibility
    const [isVisible, setIsVisible] = useState(true);
    function handleClick(){
        setIsVisible(!isVisible)
    }

    function disabledDate(date){
        //return date.getMonth() === 8;
        //return isBetween(date, new Date('2023-09-30'), new Date('2023-10-02')) || isBetween(date, new Date('2023-10-05'), new Date('2023-10-07'));

        
    }




    return(
        <div>
            <NavigationBar/>
            {/* Tour Section 1 */}
            <div className="tour-section-1 position-relative">
                <img src={require(`${image1}`)} alt="..." srcset="" />
                
                <div>
                    <h1 className="">{props.tourDetails.tourName}</h1>
                </div>
                <div className="summary-section">
                    <div>
                        <div className="summary-section-h2">
                            <h2>Highlights</h2>
                        </div>
                        <ul>
                            {props.tourDetails.highlights.map((item, index)=>{
                                return <li>{item}</li>
                            })}
                        </ul>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>What to bring</h2>
                        </div>
                        <ul>
                            {props.tourDetails.whatToBring.map((item, index)=>{
                                return <li>{item}</li>
                            })}
                        </ul>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>Suitable for</h2>
                        </div>
                        <p>{props.tourDetails.suitableFor}</p>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>Includes</h2>
                        </div>
                        <ul>
                            {props.tourDetails.includes.map((item, index)=>{
                                return <li>{item}</li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Tour Section 2 */}
            <div className="tour-section-2">
                <h1>Activities</h1>
                
                <div className="tour-section-2-content">
                    <div className="tour-text">
                        <h2>{currentActivity[0].city}</h2>
                        <p>{currentActivity[0].description}</p>
                    </div>
                    <div className="tour-image">
                        <img src={require(`${image2}`)} alt="" />
                    </div>
                </div>

                

                <div className="date-navigation-section">
                    <h2 className="date-navigation-title">Days</h2>
                    <div class="date-navigation-box">
                        {listOfActivities.map((item, index) =>{
                            //console.log(index);
                            return(item.day===currentActivity[0].day ? 
                                    <div class="date-navigation date-navigation-current" >{item.day}</div>
                                :
                                    <div class="date-navigation" onClick={()=>{changeContent(item.day)}}>{item.day}</div> )
                        })}
                    </div>
                </div>


                {/* Book Now */}
                <div class="collapse" id="collapseExample">
                    <div>
                        <form method="POST" action="#">
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
                                <label class="form-check-label" for="exampleCheck1">Sign me for the newsletter</label>
                            </div>
                            <StaticDateRangePicker
                                className="date-picker"
                                shouldDisableDate={disabledDate}
                            />
                            <button type="submit" class="btn btn-primary btn-lg btn-dark submit-btn">Submit</button>
                        </form>
                    </div>
                    
                </div>

                <a class={isVisible ? "book-btn btn btn-lg btn-dark" : "book-btn btn btn-lg btn-dark hidden"} onClick={handleClick} type="submit" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Book now
                </a>
            </div>
        </div>
    )
}
export default Tour;
