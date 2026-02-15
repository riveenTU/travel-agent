import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

function Tour(){
    // let image1 = props.tourDetails.image1
    // let listOfActivities = props.tourDetails.activities;

    const {id} = useParams();
    const [tour, setTour] = useState(null);
    //Date Navigation
    const [currentActivity, setCurrentActivity] = useState(null);
    useEffect(()=>{
        async function fetchTour(){
            try {
                const res = await fetch(`http://localhost:4000/api/tours/${id}`);
                const data = await res.json();
                setTour(data);
                setCurrentActivity(data.itinerary && data.itinerary.length ? data.itinerary[0] : null);
            } catch (error) {
                console.error("Error fetching tour data:", error);
            }
        }

        fetchTour();
    }, [id])
    
    
    // function changeContent(date){
    //     setCurrentActivity(
    //          listOfActivities.filter((item, index)=>{
    //             console.log("date "+index);
    //             return date===index+1;
    //         })
    //     )
    // }

    function changeContent(day) {
        setCurrentActivity(
            listOfActivities.find(item => item.day === day)
        );
    }

    // console.log(currentActivity);
    
    


    //Book now button visibility
    const [isVisible, setIsVisible] = useState(true);
    function handleClick(){
        setIsVisible(!isVisible)
    }

    function disabledDate(date){
        //return date.getMonth() === 8;
        //return isBetween(date, new Date('2023-09-30'), new Date('2023-10-02')) || isBetween(date, new Date('2023-10-05'), new Date('2023-10-07'));

        
    }

    if(!tour || !currentActivity){
        return <div>Loading...</div>;
    }

    const listOfActivities = tour.itinerary || [];
    const image1 = tour.coverImage || "";
    const image2 = currentActivity.image || "";


    return(
        <div>
            <NavigationBar/>
            {/* Tour Section 1 */}
            <div className="tour-section-1 position-relative">
                <img src={`http://localhost:4000${image1}`} alt="cover" />

                <div>
                    <h1 className="">{tour.name}</h1>
                </div>
                <div className="summary-section">
                    <div>
                        <div className="summary-section-h2">
                            <h2>Highlights</h2>
                        </div>
                        <ul>
                            {tour.highlights && tour.highlights.map((item, index)=>{
                                return <li key={index}>{item}</li>
                            })}
                        </ul>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>What to bring</h2>
                        </div>
                        <ul>
                            {tour.whatToBring && tour.whatToBring.map((item, index)=>{
                                return <li key={index}>{item}</li>
                            })}
                        </ul>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>Suitable for</h2>
                        </div>
                        <p>{tour.suitableFor}</p>
                    </div>
                    <hr />
                    <div>
                        <div className="summary-section-h2">
                            <h2>Includes</h2>
                        </div>
                        <ul>
                            {tour.includes && tour.includes.map((item, index)=>{
                                return <li key={index}>{item}</li>
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
                        <h2>{currentActivity.city}</h2>
                        <p>{currentActivity.description}</p>
                    </div>
                        <div className="tour-image">
                        <img src={`http://localhost:4000${image2}`} alt="activity" />
                    </div>
                </div>

                

                <div className="date-navigation-section">
                    <h2 className="date-navigation-title">Days</h2>
                    <div className="date-navigation-box">
                        {listOfActivities.map((item) =>{
                            return (item.day === currentActivity.day ?
                                <div key={item.day} className="date-navigation date-navigation-current">{item.day}</div>
                                :
                                <div key={item.day} className="date-navigation" onClick={()=>{changeContent(item.day)}}>{item.day}</div>
                            )
                        })}
                    </div>
                </div>


                {/* Book Now */}
                <div className="collapse" id="collapseExample">
                    <div>
                        <form method="POST" action="#">
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
                                <label className="form-check-label" htmlFor="exampleCheck1">Sign me for the newsletter</label>
                            </div>
                            <StaticDateRangePicker
                                className="date-picker"
                                shouldDisableDate={disabledDate}
                            />
                            <button type="submit" className="btn btn-primary btn-lg btn-dark submit-btn">Submit</button>
                        </form>
                    </div>
                    
                </div>

                <a className={isVisible ? "book-btn btn btn-lg btn-dark" : "book-btn btn btn-lg btn-dark hidden"} onClick={handleClick} type="submit" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Book now
                </a>
            </div>
        </div>
    )
}
export default Tour;
